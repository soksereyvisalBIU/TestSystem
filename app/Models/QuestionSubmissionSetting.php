<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionSubmissionSetting extends Model
{
    protected $fillable = [
        'question_id',
        'allow_file_upload',
        'allow_code_submission',
        'accepted_file_types',
        'max_file_size',
    ];

    protected $casts = [
        'allow_file_upload' => 'boolean',
        'allow_code_submission' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
