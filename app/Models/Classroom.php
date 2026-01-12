<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'visibility',
        'shift',
        'cover',
        'creator_id',
        'code', // for private classroom
    ];

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'class_id', 'id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id', 'id');
    }

    public function students()
    {
        return $this->belongsToMany(
            User::class,
            'student_classroom',
            'classroom_id',
            'user_id'
        );
    }
}
