<?php
//app\Services\AccessionService.php
namespace App\Services;

use App\Models\BookCopy;
use Illuminate\Support\Facades\DB;

class AccessionService
{
    public function generateSafeAccession()
    {
        return DB::transaction(function () {
            $year = date('Y');
            $prefix = "B{$year}-";

            $latestCopy = BookCopy::withTrashed()
                ->where('accession_number', 'like', "{$prefix}%")
                ->lockForUpdate()
                ->orderByRaw('LENGTH(accession_number) DESC')
                ->orderBy('accession_number', 'desc')
                ->first();

            if (!$latestCopy) {
                return "{$prefix}0001";
            }

            $latestNumber = (int) str_replace($prefix, '', $latestCopy->accession_number);
            $nextNumber = str_pad($latestNumber + 1, 4, '0', STR_PAD_LEFT);

            return "{$prefix}{$nextNumber}";
        });
    }
}
