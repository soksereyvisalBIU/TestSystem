<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'teacher_subject_id',
        'day_of_week',
        'start_time',
        'end_time',
        'location',
    ];
}
