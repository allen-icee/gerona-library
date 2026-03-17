<?php
//app\Models\Patron.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patron extends Model
{
    protected $fillable = [
        'library_card_number',
        'first_name',
        'middle_initial',
        'last_name',
        'suffix',
        'type',
        'email',
        'gender',
        'province',
        'municipality',
        'barangay',
        'street',
        'school',
        'contact_number',
        'status',
    ];

    public function transactions(): HasMany
    {
        return $this->hasMany(BorrowTransaction::class);
    }
}