<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    protected $table = 'class';

    protected $fillable = [
        'name',
        'description',
        'batch',
        'year',
        'semester',
        'shift',
        'cover',
        'creator_id'
    ];

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'class_id');
    }
    
}
