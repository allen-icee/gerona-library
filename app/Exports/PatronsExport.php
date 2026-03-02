<?php

namespace App\Exports;

use App\Models\Patron;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PatronsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Patron::all();
    }

    // These are the column headers at the top of the CSV
    public function headings(): array
    {
        return [
            'ID',
            'Library Card Number',
            'First Name',
            'Last Name',
            'Type',
            'Email',
            'Contact Number',
            'Gender',
            'Province',
            'Municipality',
            'Barangay',
            'School',
            'Status',
            'Registered At'
        ];
    }

    // This maps the database columns to the headers exactly
    public function map($patron): array
    {
        return [
            $patron->id,
            $patron->library_card_number,
            $patron->first_name,
            $patron->last_name,
            $patron->type,
            $patron->email,
            $patron->contact_number,
            $patron->gender,
            $patron->province,
            $patron->municipality,
            $patron->barangay,
            $patron->school,
            $patron->status,
            $patron->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
