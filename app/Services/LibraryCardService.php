<?php
//app\Services\LibraryCardService.php
namespace App\Services;

use App\Models\Patron;
use Illuminate\Support\Facades\DB;

class LibraryCardService
{

    public function generateSafeCardNumber($genderCode)
    {
        return DB::transaction(function () use ($genderCode) {
            $lastPatron = Patron::lockForUpdate()->orderBy('id', 'desc')->first();
            $nextSequence = 1;

            if ($lastPatron && preg_match('/GER-\d{2}-(\d+)/', $lastPatron->library_card_number, $matches)) {
                $nextSequence = intval($matches[1]) + 1;
            }

            return sprintf("GER-%s-%04d", $genderCode, $nextSequence);
        });
    }
}
