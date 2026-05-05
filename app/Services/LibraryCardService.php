<?php

namespace App\Services;

use App\Models\Patron;
use Illuminate\Support\Facades\DB;

class LibraryCardService
{
    /**
     * Safely generates a sequential library card number using pessimistic locking.
     */
    public function generateSafeCardNumber($genderCode)
    {
        return DB::transaction(function () use ($genderCode) {
            // Lock the latest record to prevent concurrent reads from duplicating the sequence
            $lastPatron = Patron::lockForUpdate()->orderBy('id', 'desc')->first();
            $nextSequence = 1;

            if ($lastPatron && preg_match('/GER-\d{2}-(\d+)/', $lastPatron->library_card_number, $matches)) {
                $nextSequence = intval($matches[1]) + 1;
            }

            return sprintf("GER-%s-%04d", $genderCode, $nextSequence);
        });
    }
}
