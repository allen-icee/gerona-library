<?php
//app\Exports\DonationsExport.php
namespace App\Exports;

use App\Models\Donation;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DonationsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Donation::with('receiver:id,name')->orderBy('date_received', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Donator Name',
            'Donator Type',
            'Category',
            'Description',
            'Estimated Value',
            'Received By',
            'Date Received',
        ];
    }

    public function map($donation): array
    {
        return [
            $donation->id,
            $donation->donator_name,
            $donation->donator_type,
            $donation->donation_category,
            $donation->description,
            $donation->estimated_value,
            $donation->receiver->name ?? 'System',
            $donation->date_received ? $donation->date_received->format('Y-m-d') : '',
        ];
    }
}
