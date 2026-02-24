<?php

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

    // Cast the dates so we can format them easily in React
    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    // Relationships to pull in the Patron, Book, and Librarian data
    public function patron(): BelongsTo
    {
        return $this->belongsTo(Patron::class);
    }

    public function bookCopy(): BelongsTo
    {
        return $this->belongsTo(BookCopy::class);
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }
}
