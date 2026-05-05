<?php

namespace App\Services;

use App\Models\BookCopy;
use Illuminate\Support\Facades\DB;

class AccessionService
{
    /**
     * Safely generates a sequential accession number using pessimistic locking.
     */
    public function generateSafeAccession()
    {
        // Wrap the generation in a transaction so the lock is respected
        return DB::transaction(function () {
            $year = date('Y');
            $prefix = "B{$year}-";

            // lockForUpdate() prevents other requests from reading this row until we are done saving
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
