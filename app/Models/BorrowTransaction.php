<?php
//app\Models\BorrowTransaction.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BorrowTransaction extends Model
{
    protected $fillable = [
        'patron_id',
        'book_copy_id',
        'issued_by',
        'received_by',
        'borrowed_at',
        'due_at',
        'returned_at',
        'fine_amount',
        'status',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function patron()
    {
        return $this->belongsTo(Patron::class)->withTrashed();
    }

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class)->withTrashed();
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}
