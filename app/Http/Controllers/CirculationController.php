<?php

namespace App\Http\Controllers;

use App\Models\BorrowTransaction;
use App\Models\BookCopy;
use App\Models\Patron;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Added this import
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CirculationExport;

class CirculationController extends Controller
{
    // The Circulation Dashboard
    public function index()
    {
        // Fetch all currently active (Borrowed/Overdue) transactions
        $activeTransactions = BorrowTransaction::with(['patron', 'bookCopy.book', 'issuer'])
            ->whereIn('status', ['Borrowed', 'Overdue'])
            ->latest('borrowed_at')
            ->get();

        // Pass lists of active patrons and available books to the React frontend for the dropdowns
        return Inertia::render('Admin/Circulation/Index', [
            'activeTransactions' => $activeTransactions,
            'patrons' => Patron::where('status', 'Active')->orderBy('last_name')->get(['id', 'library_card_number', 'first_name', 'last_name']),
            // Only fetch copies that are currently 'Available'
            'availableCopies' => BookCopy::with('book:id,title,author')->where('status', 'Available')->get(['id', 'book_id', 'accession_number'])
        ]);
    }

    // Handle Checking OUT a book
    public function checkout(Request $request)
    {
        $request->validate([
            'patron_id' => 'required|exists:patrons,id',
            'book_copy_id' => 'required|exists:book_copies,id',
            'due_at' => 'required|date|after:today',
        ]);

        $patron = Patron::findOrFail($request->patron_id);
        $copy = BookCopy::findOrFail($request->book_copy_id);

        // Security Check 1: Is Patron Suspended?
        if ($patron->status === 'Suspended') {
            return back()->withErrors(['patron_id' => 'This patron is currently suspended.']);
        }

        // Security Check 2: Is Book Available?
        if ($copy->status !== 'Available') {
            return back()->withErrors(['book_copy_id' => 'This book copy is not currently available.']);
        }

        // 1. Create the Transaction
        BorrowTransaction::create([
            'patron_id' => $patron->id,
            'book_copy_id' => $copy->id,
            'issued_by' => Auth::id(), // <-- Changed to Auth facade
            'borrowed_at' => now(),
            'due_at' => Carbon::parse($request->due_at),
            'status' => 'Borrowed',
        ]);

        // 2. Change the physical book's status to Borrowed!
        $copy->update(['status' => 'Borrowed']);

        return redirect()->back();
    }

    // Handle Checking IN (Returning) a book
    public function returnBook(BorrowTransaction $transaction)
    {
        // 1. Update the Transaction
        $transaction->update([
            'status' => 'Returned',
            'returned_at' => now(),
            'received_by' => Auth::id(), // <-- Changed to Auth facade
        ]);

        // 2. Change the physical book's status back to Available!
        $transaction->bookCopy->update(['status' => 'Available']);

        return redirect()->back();
    }
    public function export()
    {
        return Excel::download(new CirculationExport, 'gerona_circulation_logs.csv');
    }
}
