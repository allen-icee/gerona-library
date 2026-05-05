<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $fillable = [
        'isbn',
        'title',
        'author',
        'publisher',
        'year_published',
        'category',
        'language',
        'description',
        'cover_url'
    ];

    public function copies(): HasMany
    {
        return $this->hasMany(BookCopy::class);
    }

    // ADDED: Computed attribute for Total Copies
    public function getTotalCopiesAttribute()
    {
        return $this->copies()->count();
    }

    // ADDED: Computed attribute for Available Copies
    public function getAvailableCopiesAttribute()
    {
        return $this->copies()->where('status', 'Available')->count();
    }
}
