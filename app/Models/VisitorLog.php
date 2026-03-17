<?php
//app\Models\VisitorLog.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    protected $fillable = [
        'visitor_name',
        'address',
        'school',
        'contact_number',
        'purpose',
        'time_in',
        'time_out',
        'signature',
    ];
}
