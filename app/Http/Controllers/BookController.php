<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        // Grab the search term from the URL (if there is one)
        $search = $request->input('search');

        // Query the MySQL database
        $books = Book::query()
            ->withCount('copies') // This magically adds a 'copies_count' to each book!
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            })
            ->latest() // Orders by newest first
            ->paginate(15) // Only send 15 records to React at a time
            ->withQueryString(); // Keeps the search term in the URL when changing pages

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        // Validate against your actual database columns
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
}
