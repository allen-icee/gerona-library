<?php
//app\Models\PrintLog.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrintLog extends Model
{
    protected $fillable = [
        'visitor_name',
        'school_or_barangay',
        'pages_printed',
        'logged_by',
        'printed_at',
    ];

    protected $casts = [
        'printed_at' => 'datetime',
    ];

    public function logger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'logged_by');
    }
}
