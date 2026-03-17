<?php
//app\Exports\CirculationExport.php
namespace App\Exports;

use App\Models\BorrowTransaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CirculationExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return BorrowTransaction::with(['patron', 'bookCopy.book'])->orderBy('borrowed_at', 'desc')->get();
    }

    public function headings(): array
    {
        return ['ID', 'Patron Name', 'Library Card', 'Book Title', 'Accession Number', 'Borrowed At', 'Due Date', 'Returned At', 'Status'];
    }

    public function map($transaction): array
    {
        return [
            $transaction->id,
            $transaction->patron ? ($transaction->patron->first_name . ' ' . $transaction->patron->last_name) : 'Unknown',
            $transaction->patron->library_card_number ?? 'N/A',
            $transaction->bookCopy->book->title ?? 'Unknown Book',
            $transaction->bookCopy->accession_number ?? 'N/A',
            $transaction->borrowed_at ? \Carbon\Carbon::parse($transaction->borrowed_at)->format('Y-m-d h:i A') : '',
            $transaction->due_date ? \Carbon\Carbon::parse($transaction->due_date)->format('Y-m-d') : '',
            $transaction->returned_at ? \Carbon\Carbon::parse($transaction->returned_at)->format('Y-m-d h:i A') : '',
            $transaction->status
        ];
    }
}
