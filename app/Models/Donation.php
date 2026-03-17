<?php
//app\Models\Donation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    protected $fillable = [
        'donator_name',
        'donator_type',
        'donation_category',
        'description',
        'estimated_value',
        'date_received',
        'received_by',
    ];

    protected $casts = [
        'date_received' => 'date',
        'estimated_value' => 'decimal:2',
    ];

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
