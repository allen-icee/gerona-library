<?php
//app\Exports\BooksExport.php
namespace App\Exports;

use App\Models\Book;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BooksExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Book::withCount([
            'copies as total_copies',
            'copies as available_copies' => fn ($query) => $query->where('status', 'Available'),
        ])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'ISBN',
            'Title',
            'Author',
            'Category',
            'Published Year',
            'Publisher',
            'Total Copies',
            'Available Copies',
            'Date Added'
        ];
    }

    public function map($book): array
    {
        return [
            $book->id,
            $book->isbn,
            $book->title,
            $book->author,
            $book->category,
            $book->year_published,
            $book->publisher,
            $book->total_copies,
            $book->available_copies,
            $book->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
