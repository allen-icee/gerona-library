<?php
// app\Http\Controllers\BookController.php
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
use App\Services\AccessionService;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BookController extends Controller implements HasMiddleware
{
    protected $accessionService;

    public function __construct(AccessionService $accessionService)
    {
        $this->accessionService = $accessionService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('role:Librarian'),
        ];
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

    private function normalizeIsbn(?string $isbn): ?string
    {
        $normalized = $isbn ? strtoupper(preg_replace('/[^0-9X]/i', '', $isbn)) : null;
        return $normalized ?: null;
    }

    private function normalizeText(?string $value): string
    {
        return preg_replace('/\s+/', ' ', Str::upper(trim((string) $value)));
    }

    private function findDuplicateBook(?string $isbn, string $title, string $author, ?int $ignoreBookId = null): ?Book
    {
        $normalizedTitle = $this->normalizeText($title);
        $normalizedAuthor = $this->normalizeText($author);

        return Book::withTrashed()
            ->when($ignoreBookId, fn($query) => $query->whereKeyNot($ignoreBookId))
            ->where(function ($query) use ($isbn, $normalizedTitle, $normalizedAuthor) {
                $query->where(function ($q) use ($normalizedTitle, $normalizedAuthor) {
                    $q->whereRaw('UPPER(TRIM(title)) = ?', [$normalizedTitle])
                        ->whereRaw('UPPER(TRIM(author)) = ?', [$normalizedAuthor]);
                });

                if ($isbn) {
                    $query->orWhere(function ($q) use ($isbn, $normalizedTitle) {
                        $q->where('isbn', $isbn)
                            ->whereRaw('UPPER(TRIM(title)) = ?', [$normalizedTitle]);
                    });
                }
            })
            ->first();
    }

    private function createGeneratedCopies(Book $book, array $copies): void
    {
        foreach ($copies as $copyData) {
            BookCopy::create([
                'book_id' => $book->id,
                'accession_number' => $this->accessionService->generateSafeAccession(),
                'shelf_location' => $copyData['shelf_location'] ?? null,
                'source' => $copyData['source'] ?? 'Donated',
                'status' => 'Available',
                'date_acquired' => now(),
            ]);
        }
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $showTrashed = $request->input('trashed') === 'true';

        $titleSort = $request->input('titleSort');
        $authorSort = $request->input('authorSort');

        $books = Book::query()
            ->when($showTrashed, function ($query) {
                $query->onlyTrashed();
            })
            ->withCount('copies')
            ->with('copies')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%");
                });
            })
            ->when($titleSort, function ($query, $sort) {
                $query->orderBy('title', $sort);
            })
            ->when($authorSort, function ($query, $sort) {
                $query->orderBy('author', $sort);
            })
            ->when(!$titleSort && !$authorSort, function ($query) {
                $query->latest(); // Default sort
            })
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
            'filters' => $request->only(['search', 'titleSort', 'authorSort'])
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

        $isbn = $this->normalizeIsbn($request->isbn);

        $apiData = [];
        if ($isbn) {
            $apiData = $this->fetchBookDetails($isbn);
        }

        DB::transaction(function () use ($validated, $isbn, $apiData, $request) {
            $bookData = array_merge(
                Arr::except($validated, ['copies']),
                ['isbn' => $isbn],
                $apiData
            );

            $book = $this->findDuplicateBook($isbn, $validated['title'], $validated['author']);

            if ($book) {
                if ($book->trashed()) {
                    $book->restore();
                }

                foreach ($bookData as $field => $value) {
                    if (($book->{$field} === null || $book->{$field} === '') && $value !== null && $value !== '') {
                        $book->{$field} = $value;
                    }
                }
                $book->save();
            } else {
                $book = Book::create($bookData);
            }

            if ($request->has('copies') && count($request->copies) > 0) {
                $this->createGeneratedCopies($book, $request->copies);
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

        $isbn = $this->normalizeIsbn($request->isbn);

        $duplicate = $this->findDuplicateBook($isbn, $validated['title'], $validated['author'], $book->id);

        if ($duplicate) {
            return back()->withErrors([
                'isbn' => 'Another catalog record already uses this ISBN or title/author combination.',
            ]);
        }

        $apiData = ($isbn !== $book->isbn || !$book->cover_url)
            ? $this->fetchBookDetails($isbn)
            : ['description' => $book->description, 'cover_url' => $book->cover_url];

        $book->update(array_merge($validated, ['isbn' => $isbn], $apiData));

        return redirect()->back();
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return redirect()->back()->with('success', 'Book removed successfully.');
    }

    public function restore($id)
    {
        $book = Book::withTrashed()->findOrFail($id);
        $book->restore();

        return redirect()->back()->with('success', 'Book restored successfully from the archive.');
    }
    public function export(Request $request)
    {
        // Grab the active filters from the URL
        $filters = $request->only(['search', 'titleSort', 'authorSort']);

        // Pass the filters into the Export class
        return Excel::download(new BooksExport($filters), 'gerona_library_books.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt,xlsx,xls'
        ]);

        $file = $request->file('csv_file');

        $import = new class implements ToArray, WithHeadingRow {
            public function array(array $array) {}
        };

        $sheets = Excel::toArray($import, $file);
        $rows = $sheets[0] ?? [];

        foreach ($rows as $data) {
            $title = trim($data['title'] ?? '');
            if (!$title) continue;

            $rawIsbn = $data['isbn'] ?? '';
            $isbn = $this->normalizeIsbn($rawIsbn);
            $author = trim($data['author'] ?? '') ?: 'Unknown Author';

            $book = $this->findDuplicateBook($isbn, $title, $author);

            if ($book) {
                if ($book->trashed()) {
                    $book->restore();
                }
            } else {
                $book = Book::create([
                    'title' => $title,
                    'isbn' => $isbn,
                    'author' => $author,
                    'publisher' => trim($data['publisher'] ?? '') ?: 'Unknown Publisher',
                    'year_published' => trim($data['published_year'] ?? $data['year_published'] ?? '') ?: null,
                    'category' => trim($data['category'] ?? '') ?: 'Uncategorized',
                    'language' => trim($data['language'] ?? '') ?: 'Unknown',
                    'description' => null,
                    'cover_url' => null
                ]);
            }

            if ($isbn && empty($book->cover_url)) {
                FetchBookMetadata::dispatch($book);
            }

            $accessionNo = strtoupper(trim($data['accession_no'] ?? $data['accession_number'] ?? ''));
            $copiesTotal = (int) ($data['total_copies'] ?? $data['copies_total'] ?? 1);

            if ($accessionNo) {
                BookCopy::firstOrCreate(
                    ['accession_number' => $accessionNo],
                    [
                        'book_id' => $book->id,
                        'shelf_location' => trim($data['shelf_location'] ?? ''),
                        'status' => 'Available',
                        'source' => 'Donated',
                        'date_acquired' => now(),
                    ]
                );
            } else {
                $missingCopies = max(0, $copiesTotal - $book->copies()->count());

                for ($i = 1; $i <= $missingCopies; $i++) {
                    BookCopy::create([
                        'accession_number' => $this->accessionService->generateSafeAccession(),
                        'book_id' => $book->id,
                        'shelf_location' => trim($data['shelf_location'] ?? ''),
                        'status' => 'Available',
                        'source' => 'Donated',
                        'date_acquired' => now(),
                    ]);
                }
            }
        }

        return redirect()->back();
    }
}
