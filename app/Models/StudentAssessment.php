<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAssessment extends Model
{
    protected $table = 'student_assessments';
    protected $fillable = [
        'user_id',
        'assessment_id',
        'score',
        'attempted_amount',
    ];


    // ============ Raletion ===================
    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id', 'id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function attempts()
    {
        return $this->hasMany(StudentAssessmentAttempt::class, 'student_assessment_id', 'id');
    }
}
