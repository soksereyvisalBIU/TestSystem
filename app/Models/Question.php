<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    protected $fillable = [
        'assessment_id',
        'question_text',
        'type',
        'point',
        'order'
    ];

    // ========== Relation ===========
    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'question_id');
    }

    public function options()
    {
        return $this->hasMany(Option::class, 'question_id');
    }

    public function correctOption()
    {
        return $this->hasOne(Option::class, 'question_id')->where('is_correct', true);
    }


    public function answerHistories()
    {
        return $this->hasMany(AnswerHistory::class, 'question_id');
    }

    public function assessmentAttempts()
    {
        return $this->hasManyThrough(
            AssessmentAttempt::class,
            Answer::class,
            'question_id', // Foreign key on Answer table
            'id',          // Foreign key on AssessmentAttempt table
            'id',          // Local key on Question table
            'attempt_id'   // Local key on Answer table
        );
    }


    public function students()
    {
        return $this->hasManyThrough(
            User::class,
            AssessmentAttempt::class,
            'assessment_id', // Foreign key on AssessmentAttempt table
            'id',            // Foreign key on User table
            'assessment_id', // Local key on Question table
            'student_id'     // Local key on AssessmentAttempt table
        );
    }

    
}
