<?php
// app/Exports/BooksExport.php
namespace App\Exports;

use App\Models\Book;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\DataType;

// We use DefaultValueBinder to lock the ISBN as strict text
class BooksExport extends DefaultValueBinder implements FromQuery, WithHeadings, WithMapping, WithCustomValueBinder
{
    use Exportable;

    protected $filters;

    // Accept the filters from the Controller
    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $search = $this->filters['search'] ?? null;
        $titleSort = $this->filters['titleSort'] ?? null;
        $authorSort = $this->filters['authorSort'] ?? null;

        // Exactly the same logic used in your BookController index method
        return Book::query()
            ->withCount('copies')
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
                $query->latest();
            });
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
            $book->copies_count,
        ];
    }

    // THIS PREVENTS THE SCIENTIFIC NOTATION BUG IN EXCEL
    public function bindValue(Cell $cell, $value)
    {
        // If it is Column B (the ISBN column), explicitly force it to be a String
        if ($cell->getColumn() === 'B') {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);
            return true;
        }

        // Otherwise, format everything else normally
        return parent::bindValue($cell, $value);
    }
}
