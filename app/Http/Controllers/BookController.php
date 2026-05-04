<?php
//app\Http\Controllers\BookController.php
namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BooksExport;
use Illuminate\Support\Facades\Http;
use App\Jobs\FetchBookMetadata;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    private function generateIncrementalAccession()
    {
        $year = date('Y');
        $prefix = "B{$year}-";

        // Added withTrashed() to include soft-deleted records
        $latestCopy = BookCopy::withTrashed()
            ->where('accession_number', 'like', "{$prefix}%")
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

    private function fetchBookDetails($isbn)
    {
        if (!$isbn) {
            return ['description' => null, 'cover_url' => null];
        }

        try {
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
            ->with('copies')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $recentBooks = Book::withCount('copies')
            ->with('copies')
            ->whereDate('created_at', today())
            ->latest()
            ->get();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'recentBooks' => $recentBooks,
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

            'copies' => 'nullable|array',
            'copies.*.shelf_location' => 'nullable|string|max:255',
            'copies.*.source' => 'required|string|max:50',
        ]);

        $isbn = $request->isbn ? preg_replace('/[^0-9X]/i', '', $request->isbn) : null;

        $apiData = [];
        if ($isbn) {
            $apiData = $this->fetchBookDetails($isbn);
        }

        DB::transaction(function () use ($validated, $isbn, $apiData, $request) {
            $book = Book::create(array_merge(
                \Illuminate\Support\Arr::except($validated, ['copies']),
                ['isbn' => $isbn],
                $apiData
            ));

            if ($request->has('copies') && count($request->copies) > 0) {
                foreach ($request->copies as $copyData) {

                    BookCopy::create([
                        'book_id' => $book->id,
                        'accession_number' => $this->generateIncrementalAccession(),
                        'shelf_location' => $copyData['shelf_location'],
                        'source' => $copyData['source'] ?? 'Donated',
                        'status' => 'Available',
                        'date_acquired' => now(),
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Book and copies added successfully!');
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

                if ($isbn && empty($book->cover_url)) {
                    FetchBookMetadata::dispatch($book);
                }

                $accessionNo = trim($data['accession no.'] ?? '');
                $copiesTotal = (int) ($data['copies total'] ?? 1);

                if ($accessionNo) {
                    BookCopy::firstOrCreate(
                        ['accession_number' => $accessionNo],
                        [
                            'book_id' => $book->id,
                            'shelf_location' => trim($data['shelf location'] ?? ''),
                            'status' => 'Available',
                            'source' => 'Donated',
                            'date_acquired' => now(),
                        ]
                    );
                } else {
                    for ($i = 1; $i <= $copiesTotal; $i++) {

                        BookCopy::create([
                            'accession_number' => $this->generateIncrementalAccession(),
                            'book_id' => $book->id,
                            'shelf_location' => trim($data['shelf location'] ?? ''),
                            'status' => 'Available',
                            'source' => 'Donated',
                            'date_acquired' => now(),
                        ]);
                    }
                }
            }
        }
        fclose($handle);
        return redirect()->back();
    }
}