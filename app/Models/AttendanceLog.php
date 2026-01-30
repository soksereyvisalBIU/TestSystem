<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    protected $table = 'attendance_logs';
    protected $fillable = [
        'session_id',
        'student_id',
        'checked_in_at',
        'distance',
        'latitude',
        'longitude',
        'meta_data',
    ];
}
