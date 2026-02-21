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

    public function classroomCreator()
    {
        return $this->hasOneThrough(
            User::class,
            Classroom::class,
            'id', // Foreign key on the classrooms table...
            'id', // Foreign key on the users table...
            'class_id', // Local key on the subjects table...
            'creator_id' // Local key on the classrooms table...
        );
    }
    
}
