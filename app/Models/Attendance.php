<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory;

    // public $timestamps = false;

    protected $table = 'attendances';
    protected $fillable = [
        'attendance_session_id',
        'student_id',
        'scanned_at',
        'ip_address',
        'status',
    ];
    
}
