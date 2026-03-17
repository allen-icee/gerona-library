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
        return Book::all();
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
            $book->published_year,
            $book->publisher,
            $book->total_copies,
            $book->available_copies,
            $book->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
