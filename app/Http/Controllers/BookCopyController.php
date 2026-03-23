<?php
//app\Http\Controllers\BookCopyController.php
namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookCopyController extends Controller
{
    public function index(Book $book)
    {
        $copies = $book->copies()->latest()->get();

        return Inertia::render('Admin/Books/Copies', [
            'book' => $book,
            'copies' => $copies
        ]);
    }
    private function generateIncrementalAccession()
    {
        $year = date('Y');
        $prefix = "B{$year}-";

        $latestCopy = BookCopy::where('accession_number', 'like', "{$prefix}%")
            ->orderByRaw('LENGTH(accession_number) DESC')
            ->orderBy('accession_number', 'desc')
            ->first();

        if (!$latestCopy) {
            return "{$prefix}0001";
        }

        $latestNumber = (int) str_replace($prefix, '', $latestCopy->accession_number);
        $nextNumber = str_pad($latestNumber + 1, 4, '0', STR_PAD_LEFT);
        return "{$prefix}{$nextNumber}";
    }

    public function store(Request $request, Book $book)
    {
        $validated = $request->validate([
            'shelf_location' => 'nullable|string',
            'status' => 'required|string',
            'source' => 'required|string',
            'donator_name' => 'nullable|string',
            'date_acquired' => 'required|date',
        ]);

        BookCopy::create(array_merge($validated, [
            'book_id' => $book->id,
            'accession_number' => $this->generateIncrementalAccession(),
        ]));

        return back();
    }
    public function update(Request $request, BookCopy $copy)
    {
        $validated = $request->validate([
            'accession_number' => 'required|string|unique:book_copies,accession_number,' . $copy->id,
            'shelf_location' => 'nullable|string',
            'status' => 'required|string',
            'source' => 'required|string',
            'donator_name' => 'nullable|string',
            'date_acquired' => 'required|date',
        ]);

        $copy->update($validated);
        return back();
    }
    public function destroy(BookCopy $copy)
    {
        $copy->delete();

        return redirect()->back();
    }
}
