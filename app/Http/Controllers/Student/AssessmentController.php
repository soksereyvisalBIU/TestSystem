<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $id)
    {
        //
    }

    /**
     * Request to attempt an assessment.
     */
    public function request(Request $request, $class_id, $subject_id, $assessment_id)
    {
        // TODO: validation, check eligibility, etc.

        // ---------------------------------------------------
        // Create or get StudentAssessment record
        // ---------------------------------------------------
        $studentAssessment = StudentAssessment::firstOrCreate(attributes: [
            'user_id'       => Auth::id(),
            'assessment_id' => $assessment_id,
        ]);

        // ---------------------------------------------------
        // Fetch latest attempt
        // ---------------------------------------------------
        $latestAttempt = StudentAssessmentAttempt::where(
            'student_assessment_id',
            $studentAssessment->id
        )
            ->latest()
            ->first();

        // ---------------------------------------------------
        // Create new attempt if none exist OR last was submitted
        // ---------------------------------------------------
        if (!$latestAttempt || $latestAttempt->status === 'submitted') {
            $studentAssessmentAttempt = StudentAssessmentAttempt::create([
                'student_assessment_id' => $studentAssessment->id,
                'status'               => 'draft',
                'started_at'           => now(),
            ]);
        } else {
            // Reuse attempt: reset to draft and ensure started_at exists
            $latestAttempt->update([
                'status'     => 'draft',
                'started_at' => $latestAttempt->started_at ?? now(),
            ]);

            $studentAssessmentAttempt = $latestAttempt;
        }

        // ---------------------------------------------------
        // Redirect to attempt page
        // ---------------------------------------------------
        return redirect()
            ->route('student.classes.subjects.assessments.attempt', [
                'class_id'                      => $class_id,
                'subject_id'                    => $subject_id,
                'assessment_id'                 => $assessment_id,
                'student_assessment_id'          => $studentAssessment->id,
                'student_assessment_attempt_id' => $studentAssessmentAttempt->id,
            ])
            ->with('success', 'Assessment attempt requested successfully!');
    }



    /**
     * Show a single assessment.
     */
    public function show($class_id, $subject_id, $id)
    {
        $assessment = Assessment::findOrFail($id);

        // Create or get StudentAssessment
        $studentAssessment = StudentAssessment::firstOrCreate([
            'user_id'       => Auth::id(),
            'assessment_id' => $id,
        ]);

        // Get or create latest attempt
        $studentAssessmentAttempt = StudentAssessmentAttempt::where(
            'student_assessment_id',
            $studentAssessment->id
        )
            ->latest()
            ->first();

        if (!$studentAssessmentAttempt) {
            $studentAssessmentAttempt = StudentAssessmentAttempt::firstOrCreate([
                'student_assessment_id' => $studentAssessment->id,
            ]);
        }

        return Inertia::render('student/classroom/subject/assessment/attempt/Confirm', [
            'assessment'              => $assessment,
            'class_id'                => $class_id,
            'subject_id'              => $subject_id,
            'studentAssessment'       => $studentAssessment,
            'studentAssessmentAttempt' => $studentAssessmentAttempt,
        ]);
    }

    public function create() {}
    public function store(Request $request) {}
    public function edit(string $id) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}

    /**
     * Review completed assessment.
     */
    public function review(Request $request)
    {
        $assessmentAttempt = StudentAssessmentAttempt::with([
            'assessment',
            'answers.question.options',
            'answers.option',
        ])
            ->where('student_id', Auth::id())
            ->where('assessment_id', $request->assessment)
            ->first();

        return Inertia::render(
            "student/classroom/subject/assessment/attempt/Review",
            ['assessmentAttempt' => $assessmentAttempt]
        );
    }
}
