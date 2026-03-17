<?php
//app\Models\Book.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
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
}
