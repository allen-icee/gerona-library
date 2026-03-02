<?php

namespace App\Exports;

use App\Models\VisitorLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class VisitorLogsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        // Order by the most recent visits first
        return VisitorLog::orderBy('time_in', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'Log ID',
            'Visitor Name',
            'Address / Municipality',
            'School',
            'Purpose of Visit',
            'Time In',
            'Time Out',
        ];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->visitor_name,
            $log->address,
            $log->school,
            $log->purpose,
            \Carbon\Carbon::parse($log->time_in)->format('Y-m-d h:i A'),
            $log->time_out ? \Carbon\Carbon::parse($log->time_out)->format('Y-m-d h:i A') : 'Still Inside',
        ];
    }
}
