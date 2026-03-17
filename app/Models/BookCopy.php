<?php
//app\Models\BookCopy.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookCopy extends Model
{
    protected $fillable = [
        'book_id',
        'accession_number',
        'shelf_location',
        'status',
        'date_acquired',
        'source',
        'donator_name',
        'remarks',
        'library_id'
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(BorrowTransaction::class);
    }
}
