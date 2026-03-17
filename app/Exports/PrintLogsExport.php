<?php
//app\Exports\PrintLogsExport.php
namespace App\Exports;

use App\Models\PrintLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PrintLogsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return PrintLog::with('logger')->orderBy('printed_at', 'desc')->get();
    }

    public function headings(): array
    {
        return ['ID', 'Visitor Name', 'School / Barangay', 'Pages Printed', 'Logged By (Admin)', 'Printed At'];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->visitor_name,
            $log->school_or_barangay,
            $log->pages_printed,
            $log->logger->name ?? 'System',
            $log->printed_at ? \Carbon\Carbon::parse($log->printed_at)->format('Y-m-d h:i A') : '',
        ];
    }
}
