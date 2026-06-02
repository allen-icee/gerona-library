<?php
//app\Http\Controllers\BookCopyController.php
namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AccessionService;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BookCopyController extends Controller implements HasMiddleware
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
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:Available,Borrowed,Lost,Damaged,Maintenance',
            'source' => 'required|string|max:50',
            'donator_name' => 'nullable|string|max:255',
            'date_acquired' => 'required|date',
        ]);

        BookCopy::create(array_merge($validated, [
            'book_id' => $book->id,
            'accession_number' => $this->accessionService->generateSafeAccession(),
        ]));

        return back();
    }

    public function update(Request $request, BookCopy $copy)
    {
        if ($request->filled('accession_number')) {
            $request->merge([
                'accession_number' => strtoupper(trim($request->accession_number)),
            ]);
        }

        $validated = $request->validate([
            'accession_number' => 'required|string|max:50|unique:book_copies,accession_number,' . $copy->id,
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:Available,Borrowed,Lost,Damaged,Maintenance',
            'source' => 'required|string|max:50',
            'donator_name' => 'nullable|string|max:255',
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
