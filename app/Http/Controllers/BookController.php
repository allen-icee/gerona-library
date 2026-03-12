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
    // NEW: Upgraded CSV Importer (Auto-Generates Missing Accession Numbers)
    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('csv_file');
        $handle = fopen($file->getRealPath(), "r");

        $header = fgetcsv($handle, 1000, ",");
        if ($header) {
            $header[0] = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header[0]);
            $header = array_map('strtolower', $header);
            $header = array_map('trim', $header);
        }

        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if (count($header) == count($row) && array_filter($row)) {
                $data = array_combine($header, $row);

                $rawTitle = $data['title'] ?? '';
                if (empty($rawTitle))
                    continue;
                $title = strtoupper(trim($rawTitle));

                $rawIsbn = $data['isbn'] ?? '';
                $isbn = str_replace(['-', ' '], '', $rawIsbn);

                // Create the Master Book
                $book = \App\Models\Book::firstOrCreate(
                    ['title' => $title, 'isbn' => $isbn ?: null],
                    [
                        'author' => trim($data['author'] ?? '') ?: 'Unknown Author',
                        'publisher' => trim($data['publisher'] ?? '') ?: 'Unknown Publisher',
                        'year_published' => trim($data['year published'] ?? '') ?: null,
                        'category' => trim($data['category'] ?? '') ?: 'Uncategorized',
                        'language' => trim($data['language'] ?? '') ?: 'Unknown',
                    ]
                );

                // --- THE FIX: SMART COPY GENERATION ---
                $accessionNo = trim($data['accession no.'] ?? '');
                $copiesTotal = (int) ($data['copies total'] ?? 1); // Fallback to 1 if empty

                if (!empty($accessionNo)) {
                    // If an accession number exists, use it
                    \App\Models\BookCopy::firstOrCreate(
                        ['accession_number' => $accessionNo],
                        [
                            'book_id' => $book->id,
                            'shelf_location' => trim($data['shelf location'] ?? ''),
                            'status' => 'Available',
                            'source' => 'Purchased',
                            'date_acquired' => now(),
                        ]
                    );
                } else {
                    // If blank, auto-generate temporary accession numbers based on "Copies Total"
                    for ($i = 1; $i <= $copiesTotal; $i++) {
                        $tempAccession = 'AUTO-' . $book->id . '-C' . $i; // e.g. AUTO-14-C1
                        \App\Models\BookCopy::firstOrCreate(
                            ['accession_number' => $tempAccession],
                            [
                                'book_id' => $book->id,
                                'shelf_location' => trim($data['shelf location'] ?? ''),
                                'status' => 'Available',
                                'source' => 'Purchased',
                                'date_acquired' => now(),
                            ]
                        );
                    }
                }
            }
        }
        fclose($handle);

        return redirect()->back();
    }
}
