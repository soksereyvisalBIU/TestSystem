<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'options';
    protected $fillable = [
        'question_id',
        'option_text',
        'is_correct',
        'match_key'
    ];

    // ========== Relation ===========

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function answerHistories()
    {
        return $this->hasMany(AnswerHistory::class, 'selected_option_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'selected_option_id');
    }

    public function assessmentQuestions()
    {
        return $this->hasManyThrough(
            Question::class,
            AnswerHistory::class,
            'selected_option_id', // Foreign key on AnswerHistory table
            'id',                 // Foreign key on Question table
            'id',                 // Local key on Option table
            'question_id'         // Local key on AnswerHistory table
        );
    }

    public function students()
    {
        return $this->hasManyThrough(
            User::class,
            AnswerHistory::class,
            'selected_option_id', // Foreign key on AnswerHistory table
            'id',                 // Foreign key on User table
            'id',                 // Local key on Option table
            'student_id'          // Local key on AnswerHistory table
        );
    }

    public function assessmentAttempts()
    {
        return $this->hasManyThrough(
            AssessmentAttempt::class,
            AnswerHistory::class,
            'selected_option_id', // Foreign key on AnswerHistory table
            'id',                 // Foreign key on AssessmentAttempt table
            'id',                 // Local key on Option table
            'attempt_id'          // Local key on AnswerHistory table
        );
    }

    public function assessmentQuestionsViaAnswers()
    {
        return $this->hasManyThrough(
            Question::class,
            Answer::class,
            'selected_option_id', // Foreign key on Answer table
            'id',                 // Foreign key on Question table
            'id',                 // Local key on Option table
            'question_id'         // Local key on Answer table
        );
    }   

    public function studentsViaAnswers()
    {
        return $this->hasManyThrough(
            User::class,
            Answer::class,
            'selected_option_id', // Foreign key on Answer table
            'id',                 // Foreign key on User table
            'id',                 // Local key on Option table
            'student_id'          // Local key on Answer table
        );
    }

    public function assessmentAttemptsViaAnswers()
    {
        return $this->hasManyThrough(
            AssessmentAttempt::class,
            Answer::class,
            'selected_option_id', // Foreign key on Answer table
            'id',                 // Foreign key on AssessmentAttempt table
            'id',                 // Local key on Option table
            'attempt_id'          // Local key on Answer table
        );
    }

    public function getQuestionAttribute()
    {
        return $this->question()->first();
    }   

    public function getAnswersAttribute()
    {
        return $this->answers()->get();
    }

    public function getAnswerHistoriesAttribute()
    {
        return $this->answerHistories()->get();
    }

    public function getAssessmentQuestionsAttribute()
    {
        return $this->assessmentQuestions()->get();
    }

    
}
