<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnswerFile extends Model
{
    protected $table = 'answer_files';
    protected $fillable = [
        'answer_id',
        'file_path',
        'uploaded_at',
        'uploaded_at',
        'created_at',
    ];

    // ========== Relation ===========
    public function answer()
    {
        return $this->belongsTo(Answer::class, 'answer_id');
    }


    public function answerHistory()
    {
        return $this->belongsTo(AnswerHistory::class, 'answer_id', 'id');
    }

    public function studentCourse()
    {
        return $this->belongsTo(StudentCourse::class, 'answer_id', 'id');
    }   

    public function getStudentCourseAttribute()
    {
        return $this->studentCourse()->first();
    }

    public function assessmentAttempt()
    {
        return $this->belongsTo(AssessmentAttempt::class, 'answer_id', 'id');
    }
}
