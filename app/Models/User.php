<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enum\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;
    // use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // 'role' => UserRole::class,
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // ==== relation ====

    public function studentAssessmentAttempt()
    {
        // return $this->belongsToMany(
        //     StudentAssessment::class,
        //     'student_assessment_attempts',
        //     'assessment_id', // pivot FK to assessment
        //     'user_id',        // pivot FK to user
        // )
        //     ->withPivot(['status', 'started_at', 'completed_at'])
        //     ->withTimestamps();
    }


    // ==================

    public function classrooms()
    {
        return $this->belongsToMany(
            Classroom::class,
            'student_classroom',
            'user_id',
            'classroom_id'
        );
    }



    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // ======== new relations ========
    public function classes()
    {
        return $this->hasMany(Classroom::class, 'creator_id');
    }

    public function studentClassrooms()
    {
        return $this->belongsToMany(
            Classroom::class,
            'student_classroom', // pivot table
            'user_id',       // foreign key on pivot referring to users
            'classroom_id'      // foreign key on pivot referring to classrooms
        );
    }

    public function studentAssessment()
    {
        return $this->hasMany(StudentAssessment::class, 'user_id', 'id');
    }

    // ========== Relation ===========
    public function joinedCourses()
    {
        return $this->belongsToMany(
            Course::class,
            'student_course',   // pivot table
            'student_id',       // foreign key on pivot referring to users
            'course_id'         // foreign key on pivot referring to courses
        );
        // ->withPivot(['enrolled_at'])
        //  ->withTimestamps();
    }

    public function StudentCourse()
    {
        return $this->hasMany(StudentCourse::class, 'student_id');
    }
    public function courses()
    {
        return $this->hasMany(Course::class, 'creator_id');
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'created_by');
    }

    //
    public function studentCourses()
    {
        return $this->hasMany(StudentCourse::class, 'student_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'student_courses', 'student_id', 'course_id');
    }

    public function createdAssessments()
    {
        return $this->hasMany(Assessment::class, 'created_by');
    }

    public function createdCourses()
    {
        return $this->hasMany(Course::class, 'created_by');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class, 'student_id');
    }

    public function answerHistories()
    {
        return $this->hasMany(AnswerHistory::class, 'student_id');
    }

    public function studentCourseInCourse($courseId)
    {
        return $this->hasOne(StudentCourse::class, 'student_id')
            ->where('course_id', $courseId);
    }

    // public function getStudentCourseInCourseAttribute()
    // {
    //     return $this->studentCourseInCourse()->first();
    // }
}
