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
    public function store(Request $request, Book $book)
    {
        $validated = $request->validate([
            'accession_number' => 'required|string|unique:book_copies,accession_number',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:Available,Borrowed,Lost,Damaged,Maintenance',
            'source' => 'nullable|string|max:255',
            'donator_name' => 'nullable|string|max:255',
            'date_acquired' => 'nullable|date',
            'remarks' => 'nullable|string',
        ]);

        $book->copies()->create($validated);

        return redirect()->back();
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
