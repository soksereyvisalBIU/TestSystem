<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Laravel\Prompts\confirm;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $id) {}

    public function request(Request $request, $class_id, $subject_id, $assessment_id)
    {
        // TODO: validation, check eligibility, etc.
        // Redirect back to index route with success message


        // ---------------------------------------------------
        //   Create or increment student assessment attempt
        // ---------------------------------------------------
        $studentAssessment = StudentAssessment::firstOrCreate(
            [
                'user_id'       => Auth::user()->id,
                'assessment_id' => $assessment_id
            ]
        );

        $studentAssessmentAttempt = StudentAssessmentAttempt::firstOrCreate([
            'student_assesment_id' => $studentAssessment->id,
            'status' => "draft",
            'started_at' => now(),
            // 'completed_at',
            // 'sub_score',
        ]);

        // dd($studentAssessmentAttempt);

        return redirect()
            // ->route('student.classes.subjects.assessments.index', [
            ->route('student.classes.subjects.assessments.attempt', [
                'class_id' => $class_id,
                'subject_id' => $subject_id,
                'assessment_id' => $assessment_id,
                'student_assesment_id' => $studentAssessment->id,
                'student_assessment_attempt_id' => $studentAssessmentAttempt->id
            ])
            ->with('success', 'Assessment attempt requested successfully!');
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($class_id, $subject_id, $id)
    {
        $assessment = Assessment::findOrFail($id);

        // Find or create student assessment
        $studentAssessment = StudentAssessment::firstOrCreate([
            'user_id' => Auth::id(),
            'assessment_id' => $id,
        ]);

        // ------------------------------
        // Check last attempt (1 minute rule)
        // ------------------------------
        $lastAttempt = StudentAssessmentAttempt::where('student_assesment_id', $studentAssessment->id)
            ->latest()
            ->first();

        if ($lastAttempt && $lastAttempt->started_at->gt(now()->subMinute())) {
            // Reuse last attempt
            $studentAssessmentAttempt = $lastAttempt;
        } else {
            // Create new attempt
            $studentAssessmentAttempt = StudentAssessmentAttempt::create([
                'student_assesment_id' => $studentAssessment->id,
                'status' => 'pending',
                'started_at' => now(),
            ]);
        }

        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Confirm',
            compact('assessment', 'class_id', 'subject_id', 'studentAssessment', 'studentAssessmentAttempt')
        );
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function review(Request $request)
    {
        $assessmentAttempt = StudentAssessmentAttempt::with(['assessment', 'answers.question.options', 'answers.option'])->where('student_id', Auth::id())->where('assessment_id', $request->assessment)->first();

        return Inertia::render("student/classroom/subject/assessment/attempt/Review", [
            'assessmentAttempt' => $assessmentAttempt,
        ]);
    }
}
