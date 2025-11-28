<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentCourse extends Model
{
    protected $table = 'student_course';
    protected $fillable = [
        'student_id',
        'course_id',
        'enrolled_at',
        'join_at',
        'update_at',
        'create_at'
    ];

    // ========== Relation ===========

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function assessmentAttempts()
    {
        return $this->hasMany(AssessmentAttempt::class, 'student_id', 'student_id')
                    ->whereHas('assessment', function ($query) {
                        $query->where('course_id', $this->course_id);
                    });
    }

    public function getAssessmentsAttribute()
    {
        return $this->course->assessments()->get();
    }

    public function getAttemptsAttribute()
    {
        return $this->assessmentAttempts()->get();
    }

    public function getStudentAttribute()
    {
        return $this->student()->first();
    }

    public function getCourseAttribute()
    {
        return $this->course()->first();
    }

    public function getAttemptCountAttribute()
    {
        return $this->assessmentAttempts()->count();
    }

    

}
