<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentAttempt extends Model
{
    protected $table = 'assessment_attempts';
    protected $fillable = [
        'assessment_id',
        'student_id',
        'started_at',
        'completed_at',
        'score',

        'assessment_id',
        'user_id',
        'token',
        'started_at',
        'ended_at',
        'last_accessed_at',
        'ip_address',
        'user_agent',
        'score',
        'is_submitted',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'is_submitted' => 'boolean',
    ];
    

    // ========== Relation ===========

    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function isActive(): bool
    {
        return !$this->ended_at && !$this->is_submitted;
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'attempt_id');
    }

    public function answerHistories()
    {
        return $this->hasMany(AnswerHistory::class, 'attempt_id');
    }

    public function course()
    {
        return $this->assessment->course();
    }

    public function questions()
    {
        return $this->assessment->questions();
    }

    public function studentCourse()
    {
        return $this->belongsTo(StudentCourse::class, 'student_id', 'student_id')
                    ->where('course_id', $this->assessment->course_id);
    }


    public function getStudentCourseAttribute()
    {
        return $this->studentCourse()->first();
    }

    public function getCourseAttribute()
    {
        return $this->assessment->course;
    }

    public function getQuestionsAttribute()
    {
        return $this->assessment->questions;
    }   

    public function getAnswersAttribute()
    {
        return $this->answers();
    }

    public function getAnswerHistoriesAttribute()
    {
        return $this->answerHistories();
    }

    public function getStudentAttribute()
    {
        return $this->student()->first();
    }

    public function getAssessmentAttribute()
    {
        return $this->assessment()->first();
    }

    public function getCourseIdAttribute()
    {
        return $this->assessment->course_id;
    }

    public function getQuestionCountAttribute()
    {
        return $this->assessment->questions()->count();
    }

    public function getIsCompletedAttribute()
    {
        return !is_null($this->completed_at);
    }

    public function getTimeTakenAttribute()
    {
        if ($this->is_completed) {
            return $this->completed_at->diffInSeconds($this->started_at);
        }
        return null;
    }

    public function getScorePercentageAttribute()
    {
        $questionCount = $this->question_count;
        if ($questionCount === 0) {
            return 0;
        }
        return ($this->score / $questionCount) * 100;
    }

    public function getAverageScoreAttribute()
    {
        $totalAttempts = self::where('assessment_id', $this->assessment_id)->count();
        if ($totalAttempts === 0) {
            return 0;
        }
        $totalScore = self::where('assessment_id', $this->assessment_id)->sum('score');
        return $totalScore / $totalAttempts;
    }

    public function getMaxScoreAttribute()
    {
        return self::where('assessment_id', $this->assessment_id)->max('score');
    }

    public function getMinScoreAttribute()
    {
        return self::where('assessment_id', $this->assessment_id)->min('score');
    }

    public function getAttemptNumberAttribute()
    {
        return self::where('assessment_id', $this->assessment_id)
                    ->where('student_id', $this->student_id)
                    ->where('id', '<=', $this->id)
                    ->count();
    }
    
}
