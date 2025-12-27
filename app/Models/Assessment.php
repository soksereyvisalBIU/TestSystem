<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $table = 'assessments';
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'type',
        'start_time',
        'end_time',
        'duration',
        'max_attempts',
        'created_by',
    ];

    public function studentAssessment()
    {
        return $this->hasOne(StudentAssessment::class, 'assessment_id')
            ->where('user_id', auth()->id());
    }


    // ========== Relation ===========
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    // Assessment.php

    public function subjects()
    {

        // return $this->belongsTo(
        //     Subject::class,
        //     'subject_assessment',     // pivot table
        //     'assessment_id',          // FK on pivot
        //     'subject_id'              // FK on pivot
        // );
        return $this->belongsToMany(
            Subject::class,
            'subject_assessment',     // pivot table
            'assessment_id',          // FK on pivot
            'subject_id'              // FK on pivot
        );
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function total_questions()
    {
        return $this->hasMany(Question::class, 'assessment_id')->count();
    }

    public function questions()
    {
        return $this->hasMany(Question::class, 'assessment_id');
    }

    public function students()
    {
        return $this->belongsToMany(
            User::class,
            'student_assessments',
            'assessment_id', // pivot FK to assessment
            'user_id'        // pivot FK to user
        )
            ->withPivot(['score', 'attempted_amount'])
            ->withTimestamps();
    }
    public function student($studentId)
    {
        return $this->belongsToMany(
            User::class,
            'student_assessments',
            'assessment_id',
            'user_id'
        )
            ->where('users.id', $studentId)
            ->withPivot(['score', 'attempted_amount'])
            ->withTimestamps();
    }


    public function attempts()
    {
        return $this->hasMany(AssessmentAttempt::class, 'assessment_id');
    }

    public function getCourseAttribute()
    {
        return $this->course()->first();
    }
    public function getQuestionsAttribute()
    {
        return $this->questions()->get();
    }
    public function getAttemptsAttribute()
    {
        return $this->attempts()->get();
    }

    public function getCreatorAttribute()
    {
        return $this->creator()->first();
    }

    public function getAttemptCountAttribute()
    {
        return $this->attempts()->count();
    }

    public function getQuestionCountAttribute()
    {
        return $this->questions()->count();
    }
    public function getAverageScoreAttribute()
    {
        return $this->attempts()->avg('score');
    }

    public function getMaxScoreAttribute()
    {
        return $this->attempts()->max('score');
    }

    public function getMinScoreAttribute()
    {
        return $this->attempts()->min('score');
    }

    public function getTotalAttemptsAttribute()
    {
        return $this->attempts()->count();
    }

    public function getIsActiveAttribute()
    {
        $now = now();
        return $this->start_time <= $now && $now <= $this->end_time;
    }

    public function getDurationInHoursAttribute()
    {
        return $this->duration ? $this->duration / 60 : null;
    }

    public function getTypeLabelAttribute()
    {
        switch ($this->type) {
            case 'quiz':
                return 'Quiz';
            case 'exam':
                return 'Exam';
            default:
                return 'Unknown';
        }
    }

    public function getCreatedByUserAttribute()
    {
        return $this->creator()->first();
    }

    public function getCourseTitleAttribute()
    {
        return $this->course ? $this->course->name : null;
    }

    public function getIsCurrentlyAvailableAttribute()
    {
        $now = now();
        return $this->start_time <= $now && $now <= $this->end_time;
    }

    public function getRemainingAttemptsAttribute($studentId)
    {
        if (is_null($this->max_attempts)) {
            return null; // Unlimited attempts
        }
        $usedAttempts = $this->attempts()->where('student_id', $studentId)->count();
        return max(0, $this->max_attempts - $usedAttempts);
    }

    public function getTimeLeftAttribute()
    {
        $now = now();
        if ($now > $this->end_time) {
            return 0;
        }
        return $now->diffInSeconds($this->end_time);
    }

    public function getIsPastDueAttribute()
    {
        $now = now();
        return $now > $this->end_time;
    }
    public function getCreatorNameAttribute()
    {
        return $this->creator ? $this->creator->name : null;
    }
}
