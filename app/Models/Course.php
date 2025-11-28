<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';
    protected $fillable = [
        'name',
        'code',
        'description',
        'cover',
        'created_by',
    ];


    // ========== Relation ===========
    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'course_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class, 'course_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_course', 'course_id', 'student_id');
    }

    public function getAssessmentsAttribute()
    {
        return $this->assessments()->get();
    }

    public function getStudentsAttribute()
    {
        return $this->students()->get();
    }

    public function getCreatorAttribute()
    {
        return $this->creator()->first();
    }

    public function getStudentCourseCountAttribute()
    {
        return $this->studentCourses()->count();
    }

    public function getAssessmentCountAttribute()
    {
        return $this->assessments()->count();
    }

    public function getAssessmentAttemptsAttribute()
    {
        return AssessmentAttempt::whereIn('assessment_id', $this->assessments()->pluck('id'))->get();
    }

    public function getAssessmentAttemptCountAttribute()
    {
        return AssessmentAttempt::whereIn('assessment_id', $this->assessments()->pluck('id'))->count();
    }

    public function getAverageAttemptsPerStudentAttribute()
    {
        $studentCount = $this->getStudentCourseCountAttribute();
        if ($studentCount === 0) {
            return 0;
        }
        return $this->getAssessmentAttemptCountAttribute() / $studentCount;
    }

    public function getAverageAssessmentsPerStudentAttribute()
    {
        $studentCount = $this->getStudentCourseCountAttribute();
        if ($studentCount === 0) {
            return 0;
        }
        return $this->getAssessmentCountAttribute() / $studentCount;
    }

    public function getAverageAttemptsPerAssessmentAttribute()
    {
        $assessmentCount = $this->getAssessmentCountAttribute();
        if ($assessmentCount === 0) {
            return 0;
        }
        return $this->getAssessmentAttemptCountAttribute() / $assessmentCount;
    }

    public function getCreatedAtAttribute($value)
    {
        return date('Y-m-d H:i:s', strtotime($value));
    }

    public function getUpdatedAtAttribute($value)
    {
        return date('Y-m-d H:i:s', strtotime($value));
    }

    public function studentCourseInStudent($studentId)
    {
        return $this->hasOne(StudentCourse::class, 'course_id')
                    ->where('student_id', $studentId);
    }

    public function getStudentCourseInStudentAttribute()
    {
        return $this->studentCourseInStudent()->first();
    }

    public function getIsEnrolledAttribute()
    {
        // This attribute can be set dynamically based on the authenticated user context
        return $this->attributes['is_enrolled'] ?? false;
    }
}
