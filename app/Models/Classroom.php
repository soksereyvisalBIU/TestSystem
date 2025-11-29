<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $table = 'classrooms';
    protected $fillable = [
        'name',
        'description',
        'campus',
        'major',
        'batch',
        'year',
        'semester',
        'shift',
        'cover',
        'creator_id',
    ];

    public function subjects(){
                return $this->hasMany(Subject::class, 'class_id');

    }
}
