<?php

namespace App\Http\Controllers;

use App\Models\BorrowTransaction;
use App\Models\BookCopy;
use App\Models\Patron;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CirculationExport;
use Illuminate\Support\Facades\DB;

class CirculationController extends Controller
{
    public function index()
    {
        $activeTransactions = BorrowTransaction::with(['patron', 'bookCopy.book', 'issuer'])
            ->whereIn('status', ['Borrowed', 'Overdue'])
            ->latest('borrowed_at')
            ->get();

        return Inertia::render('Admin/Circulation/Index', [
            'activeTransactions' => $activeTransactions,
            'patrons' => Patron::where('status', 'Active')->orderBy('last_name')->get(['id', 'library_card_number', 'first_name', 'last_name']),
            'availableCopies' => BookCopy::with('book:id,title,author')->where('status', 'Available')->get(['id', 'book_id', 'accession_number'])
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'patron_id' => 'required|exists:patrons,id',
            'book_copy_id' => 'required|exists:book_copies,id',
            'due_at' => 'required|date|after:today',
        ]);

        $patron = Patron::findOrFail($request->patron_id);

        if ($patron->status === 'Suspended') {
            return back()->withErrors(['patron_id' => 'This patron is currently suspended.']);
        }

        try {
            DB::transaction(function () use ($request, $patron) {
                // Lock the specific copy to prevent concurrent checkouts
                $copy = BookCopy::where('id', $request->book_copy_id)->lockForUpdate()->first();

                // Validation happens inside the lock
                if ($copy->status !== 'Available') {
                    throw new \Exception('This book copy is no longer available.');
                }

                BorrowTransaction::create([
                    'patron_id' => $patron->id,
                    'book_copy_id' => $copy->id,
                    'issued_by' => Auth::id(),
                    'borrowed_at' => now(),
                    'due_at' => Carbon::parse($request->due_at),
                    'status' => 'Borrowed',
                ]);

                $copy->update(['status' => 'Borrowed']);
            });

            return redirect()->back()->with('success', 'Book checked out successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['book_copy_id' => $e->getMessage()]);
        }
    }

    public function returnBook(BorrowTransaction $transaction)
    {
        try {
            DB::transaction(function () use ($transaction) {
                // Lock the transaction to prevent double returns
                $lockedTransaction = BorrowTransaction::where('id', $transaction->id)->lockForUpdate()->first();

                if ($lockedTransaction->status === 'Returned') {
                    throw new \Exception('This transaction has already been completed.');
                }

                $lockedTransaction->update([
                    'status' => 'Returned',
                    'returned_at' => now(),
                    'received_by' => Auth::id(),
                ]);

                // Update the associated copy
                $lockedTransaction->bookCopy->update(['status' => 'Available']);
            });

            return redirect()->back()->with('success', 'Book returned successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function export()
    {
        return Excel::download(new CirculationExport, 'gerona_circulation_logs.csv');
    }
}
