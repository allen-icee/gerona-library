<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BooksExport;
use Illuminate\Support\Facades\Http;

class BookController extends Controller
{
    /**
     * Fetch Book Metadata (Used ONLY for single manual additions)
     */
    private function fetchBookDetails($isbn)
    {
        if (!$isbn) {
            return ['description' => null, 'cover_url' => null];
        }

        try {
            // 1. Google Books API (Faster timeout)
            $google = Http::timeout(3)->get('https://www.googleapis.com/books/v1/volumes', ['q' => "isbn:$isbn"]);

            if ($google->successful() && isset($google['items'][0])) {
                $info = $google['items'][0]['volumeInfo'];
                return [
                    'description' => $info['description'] ?? null,
                    'cover_url' => isset($info['imageLinks']['thumbnail'])
                        ? str_replace('http://', 'https://', $info['imageLinks']['thumbnail'])
                        : null
                ];
            }

            // 2. OpenLibrary API (Faster timeout)
            $open = Http::timeout(3)->get('https://openlibrary.org/api/books', [
                'bibkeys' => "ISBN:$isbn",
                'format' => 'json',
                'jscmd' => 'data'
            ]);

            if ($open->successful()) {
                $data = $open->json();
                if (isset($data["ISBN:$isbn"])) {
                    $book = $data["ISBN:$isbn"];
                    return [
                        'description' => $book['notes'] ?? null,
                        'cover_url' => isset($book['cover'])
                            ? ($book['cover']['large'] ?? $book['cover']['medium'] ?? $book['cover']['small'] ?? null)
                            : null
                    ];
                }
            }

        } catch (\Exception $e) {
            // Ignore network errors
        }

        // FIX FOR 404 ERRORS: We return null instead of a broken link.
        // The frontend React component will see null and safely show the pink CSS cover.
        return [
            'description' => null,
            'cover_url' => null
        ];
    }

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

        $isbn = $request->isbn ? preg_replace('/[^0-9X]/i', '', $request->isbn) : null;
        $apiData = $this->fetchBookDetails($isbn); // Safe to fetch here because it's only 1 book

        Book::create(array_merge($validated, ['isbn' => $isbn], $apiData));

        return redirect()->back();
    }

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

        $isbn = $request->isbn ? preg_replace('/[^0-9X]/i', '', $request->isbn) : null;

        // Only fetch API data if they changed the ISBN or if the book doesn't have a cover yet
        $apiData = ($isbn !== $book->isbn || !$book->cover_url)
            ? $this->fetchBookDetails($isbn)
            : ['description' => $book->description, 'cover_url' => $book->cover_url];

        $book->update(array_merge($validated, ['isbn' => $isbn], $apiData));

        return redirect()->back();
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return redirect()->back();
    }

    public function export()
    {
        return Excel::download(new BooksExport, 'gerona_library_books.csv');
    }

    /**
     * CSV Import (Super Fast - No API freezing)
     */
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

                $title = strtoupper(trim($data['title'] ?? ''));
                if (!$title)
                    continue;

                $rawIsbn = $data['isbn'] ?? '';
                $isbn = $rawIsbn ? preg_replace('/[^0-9X]/i', '', $rawIsbn) : null;

                // FIX FOR FREEZING: We completely removed the API fetching from here.
                // It now instantly saves the book data directly from the CSV.
                $book = Book::firstOrCreate(
                    [
                        'title' => $title,
                        'isbn' => $isbn ?: null
                    ],
                    [
                        'author' => trim($data['author'] ?? '') ?: 'Unknown Author',
                        'publisher' => trim($data['publisher'] ?? '') ?: 'Unknown Publisher',
                        'year_published' => trim($data['year published'] ?? '') ?: null,
                        'category' => trim($data['category'] ?? '') ?: 'Uncategorized',
                        'language' => trim($data['language'] ?? '') ?: 'Unknown',
                        'description' => null,
                        'cover_url' => null
                    ]
                );

                // Instantly generate copies
                $accessionNo = trim($data['accession no.'] ?? '');
                $copiesTotal = (int) ($data['copies total'] ?? 1);

                if ($accessionNo) {
                    BookCopy::firstOrCreate(
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
                    for ($i = 1; $i <= $copiesTotal; $i++) {
                        $autoAccession = 'AUTO-' . $book->id . '-C' . $i;
                        BookCopy::firstOrCreate(
                            ['accession_number' => $autoAccession],
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