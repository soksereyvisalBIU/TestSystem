<?php

use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StudentAssessmentAttemptService
{
    public function startOrResume(Assessment $assessment, User $user)
    {
        return DB::transaction(function () use ($assessment, $user) {

            $studentAssessment = StudentAssessment::firstOrCreate([
                'user_id'       => $user->id,
                'assessment_id' => $assessment->id,
            ]);

            $attempt = $studentAssessment
                ->attempts()
                ->where('status', 'draft')
                ->latest()
                ->lockForUpdate()
                ->first();

            if ($attempt) {
                return $attempt;
            }

            return $studentAssessment->attempts()->create([
                'status'     => 'draft',
                'started_at' => now(),
            ]);
        });
    }
}
