<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintLog extends Model
{
    protected $fillable = [
        'visitor_name',
        'school_or_barangay',
        'pages_printed',
        'logged_by',
    ];
}
