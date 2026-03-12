<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCatalogController extends Controller
{
    public function index(Request $request)
    {
        // Get books and count physical copies that are specifically 'Available'
        $query = Book::withCount([
            'copies as available_copies' => function ($query) {
                $query->where('status', 'Available');
            }
        ]);

        // 1. Search Query
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        // 2. Category Filter
        if ($category = $request->input('category')) {
            $query->where('category', $category);
        }

        // 3. Availability Filter
        if ($request->input('available') == '1') {
            $query->having('available_copies', '>', 0);
        }

        // 4. SORTING: Aligned with CSV Data
        $sort = $request->input('sort', 'newest');
        match ($sort) {
            'title' => $query->orderBy('title', 'asc'),
            'author' => $query->orderBy('author', 'asc'),
            'year' => $query->orderBy('year_published', 'desc'), // New sort option!
            'newest' => $query->orderBy('created_at', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $books = $query->paginate(12)->withQueryString();

        // 5. DYNAMIC CATEGORIES: Plucks exact unique categories from your database
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