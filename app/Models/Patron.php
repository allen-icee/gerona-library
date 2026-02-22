<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patron extends Model
{
    protected $fillable = [
        'library_card_number',
        'first_name',
        'last_name',
        'type',
        'school_or_barangay',
        'contact_number',
        'status'
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(BorrowTransaction::class);
    }
}
