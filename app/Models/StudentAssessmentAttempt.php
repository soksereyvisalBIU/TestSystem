<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAssessmentAttempt extends Model
{
    protected $table = 'student_assessment_attempts';
    protected $fillable = [
        'student_assessment_id',
        'status',
        'started_at',
        'completed_at',
        'sub_score',
    ];

    protected $casts = [
        'started_at' => 'datetime',
    ];


    public function studentAssessment()
    {
        return $this->belongsTo(StudentAssessment::class, 'student_assessment_id', 'id');
    }

    public function assessment()
    {
        return $this->hasOneThrough(
            Assessment::class,
            StudentAssessment::class,
            'id', // Foreign key on StudentAssessment table...
            'id', // Foreign key on Assessment table...
            'student_assessment_id', // Local key on StudentAssessmentAttempt table...
            'assessment_id' // Local key on StudentAssessment table...
        );
    }

    public function student()
    {
        return $this->hasOneThrough(
            User::class,
            StudentAssessment::class,
            'id', // Foreign key on StudentAssessment table...
            'id', // Foreign key on User table...
            'student_assessment_id', // Local key on StudentAssessmentAttempt table...
            'user_id' // Local key on StudentAssessment table...
        );
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'student_assessment_attempt_id', 'id');
    }
}
