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
        'attempted',
    ];
}
