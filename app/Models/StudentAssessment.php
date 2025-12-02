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


    // ============ Raletion ===================
    public function assessment(){
        return $this->belongsTo(Assessment::class, 'assessment_id' , 'id');
    }

    public function student() {
        return $this->belongsTo(User::class, 'user_id' , 'id');
    }

    
}
