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
        return Donation::with('user')->orderBy('donation_date', 'desc')->get();
    }

    public function headings(): array
    {
        return ['ID', 'Donor Name', 'Items Donated', 'Received By (Admin)', 'Date Donated'];
    }

    public function map($donation): array
    {
        return [
            $donation->id,
            $donation->donor_name,
            $donation->items_donated,
            $donation->user->name ?? 'System',
            $donation->donation_date ? \Carbon\Carbon::parse($donation->donation_date)->format('Y-m-d') : '',
        ];
    }
}
