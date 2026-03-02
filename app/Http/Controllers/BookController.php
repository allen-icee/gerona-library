<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BooksExport;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $books = Book::query()
            ->withCount('copies')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:255',
            'year_published' => 'nullable|string|max:4',
            'category' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:50',
        ]);

        Book::create($validated);

        return redirect()->back();
    }

    // NEW: Update existing book
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:255',
            'year_published' => 'nullable|string|max:4',
            'category' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:50',
        ]);

        $book->update($validated);

        return redirect()->back();
    }

    // NEW: Delete a book
    public function destroy(Book $book)
    {
        $book->delete();

        return redirect()->back();
    }

    public function export()
    {
        return Excel::download(new BooksExport, 'gerona_library_books.csv');
    }
}
