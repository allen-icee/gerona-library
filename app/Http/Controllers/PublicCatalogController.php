<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCatalogController extends Controller
{
    public function index(Request $request)
    {
        // 1. Start the query and count total copies + available copies
        $query = Book::query()
            ->withCount([
                'copies as total_copies',
                'copies as available_copies' => function ($q) {
                    $q->where('status', 'Available');
                }
            ]);

        // 2. Handle the search bar input
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                    ->orWhere('author', 'like', $searchTerm)
                    ->orWhere('category', 'like', $searchTerm)
                    ->orWhere('isbn', 'like', $searchTerm);
            });
        }

        // 3. Paginate the results (12 books per page)
        $books = $query->orderBy('title')->paginate(12)->withQueryString();

        return Inertia::render('Public/Catalog', [
            'books' => $books,
            'filters' => $request->only('search')
        ]);
    }
}
