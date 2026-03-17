<?php
//app\Http\Controllers\PublicCatalogController.php
namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::withCount([
            'copies as available_copies' => function ($query) {
                $query->where('status', 'Available');
            }
        ]);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        if ($request->input('available') == '1') {
            $query->having('available_copies', '>', 0);
        }

        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'title' => $query->orderBy('title', 'asc'),
            'author' => $query->orderBy('author', 'asc'),
            'year' => $query->orderBy('year_published', 'desc'),
            'newest' => $query->orderBy('created_at', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $books = $query->paginate(12)->withQueryString();

        $categories = Book::whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('Public/Catalog', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'available', 'sort'])
        ]);
    }
}