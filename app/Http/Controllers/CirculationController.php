<?php
//app\Http\Controllers\CirculationController.php
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
        $copy = BookCopy::findOrFail($request->book_copy_id);

        if ($patron->status === 'Suspended') {
            return back()->withErrors(['patron_id' => 'This patron is currently suspended.']);
        }

        if ($copy->status !== 'Available') {
            return back()->withErrors(['book_copy_id' => 'This book copy is not currently available.']);
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

        return redirect()->back();
    }

    public function returnBook(BorrowTransaction $transaction)
    {
        $transaction->update([
            'status' => 'Returned',
            'returned_at' => now(),
            'received_by' => Auth::id(),
        ]);

        $transaction->bookCopy->update(['status' => 'Available']);

        return redirect()->back();
    }
    public function export()
    {
        return Excel::download(new CirculationExport, 'gerona_circulation_logs.csv');
    }
}
