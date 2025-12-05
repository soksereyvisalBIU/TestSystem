<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    protected $table = 'answers';
    protected $fillable = [
        'attempt_id',
        'question_id',
        'answer_text',
        'selected_option_id',
        'file_path',
        'code_submission',
        'is_correct',
        'points_earned',
        'student_assessment_attempt_id',
        'option_id'
    ];

    // ========== Relation ===========

    public function studentAssessmentAttempt(){
        
        return $this->belongsTo(StudentAssessmentAttempt::class, 'student_assessment_attempt_id');
    }
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
    public function attempt()
    {
        return $this->belongsTo(Attempt::class, 'attempt_id');
    }
    public function selectedOption()
    {
        return $this->belongsTo(Option::class, 'selected_option_id');
    }
    public function answerHistories()
    {
        return $this->hasMany(AnswerHistory::class, 'answer_id');
    }
    public function assessmentAttempt()
    {
        return $this->belongsTo(AssessmentAttempt::class, 'attempt_id');
    }

    public function assessmentQuestion()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function assessment()
    {
        return $this->assessmentAttempt->assessment();
    }

    public function student()
    {
        return $this->assessmentAttempt->student();
    }
}
