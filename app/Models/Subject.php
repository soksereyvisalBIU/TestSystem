<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{

    protected $table = 'subjects';

    protected $fillable = [
        'name',
        'description',
        'class_id',
        'visibility',   
        'cover',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_id' , 'id');
    }
    // Subject.php
    public function assessments()
    {
        return $this->belongsToMany(
            Assessment::class,
            'subject_assessment',
            'subject_id',
            'assessment_id'
        );
    }
}
