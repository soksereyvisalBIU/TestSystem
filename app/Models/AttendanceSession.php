<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $table = 'attendance_sessions';
    protected $fillable = [
        'teacher_subject_id',
        'qr_token',
        'class_code',
        'qr_expires_at',
        'started_at',
        'ended_at',
        'is_active',
    ];

    protected $casts = [
        'qr_expires_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    // public function teacherSubject()
    // {
    //     return $this->belongsTo(TeacherSubject::class);
    // }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
