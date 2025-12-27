<?php

namespace App\Policies\Student;


use App\Models\StudentAssessmentAttempt;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudentAssessmentAttemptPolicy
{
    /**
     * Student can view (attempt / review) ONLY their own attempt
     */
    public function view(User $user, StudentAssessmentAttempt $attempt): bool
    {
        return $attempt->studentAssessment->user_id === $user->id;
    }

    /**
     * Student can actively attempt ONLY if not submitted
     */
    public function attempt(User $user, StudentAssessmentAttempt $attempt): bool
    {
        return $attempt->studentAssessment->user_id === $user->id
            && $attempt->status !== 'submitted';
    }

    /**
     * Student can review ONLY after submission
     */
    public function review(User $user, StudentAssessmentAttempt $attempt): bool
    {
        return $attempt->studentAssessment->user_id === $user->id
            && ($attempt->status === 'submitted' || $attempt->status === 'scored');
    }
}
