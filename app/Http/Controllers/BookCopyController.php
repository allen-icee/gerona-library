<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookCopyController extends Controller
{
    // Display all physical copies for a specific Master Book
    public function index(Book $book)
    {
        // Fetch copies associated with this book, newest first
        $copies = $book->copies()->latest()->get();

        return Inertia::render('Admin/Books/Copies', [
            'book' => $book,
            'copies' => $copies
        ]);
    }

    // Save a new physical copy (barcode) to the database
    public function store(Request $request, Book $book)
    {
        $validated = $request->validate([
            'accession_number' => 'required|string|unique:book_copies,accession_number',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:Available,Borrowed,Lost,Damaged,Maintenance',
            'source' => 'nullable|string|max:255', // e.g., Purchased, Donated
            'donator_name' => 'nullable|string|max:255',
            'date_acquired' => 'nullable|date',
            'remarks' => 'nullable|string',
        ]);

        $book->copies()->create($validated);

        return redirect()->back();
    }

    // Permanently delete a physical copy (e.g., if it was destroyed)
    public function destroy(BookCopy $copy)
    {
        $copy->delete();

        return redirect()->back();
    }
}
