<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\AccessionService; // Import the service

class BookCopyController extends Controller
{
    protected $accessionService;

    // Inject the service
    public function __construct(AccessionService $accessionService)
    {
        $this->accessionService = $accessionService;
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
            'shelf_location' => 'nullable|string',
            'status' => 'required|string',
            'source' => 'required|string',
            'donator_name' => 'nullable|string',
            'date_acquired' => 'required|date',
        ]);

        BookCopy::create(array_merge($validated, [
            'book_id' => $book->id,
            // FIXED: Using the shared safe service
            'accession_number' => $this->accessionService->generateSafeAccession(),
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
