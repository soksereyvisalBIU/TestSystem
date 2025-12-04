<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\StudentAssessmentAttemptResource;
use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('instructor.classroom.subject.assessment.student.Index');
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
    public function show($class, $subject, $assessment, $id)
    {
        $assessmentId = $assessment;
        // Get the assessment (validate)
        $assessment = Assessment::with('questions.options')->findOrFail($assessmentId);

        // Get the student's assessment row
        $studentAssessment = StudentAssessment::where('assessment_id', $assessmentId)
            ->where('user_id', $id)
            ->firstOrFail();

        // Get the latest attempt
        $attempt = $studentAssessment->attempts()->with('answers')->latest()->first();

        // return response()->json($attempt);

        return Inertia::render('instructor/classroom/subject/assessment/student/Show', compact('attempt', 'assessment'));
    }


    //     public function review(Request $request)
    // {
    //     $assessmentAttempt = StudentAssessmentAttempt::with([
    //         'assessment',
    //         'answers.question.options',
    //         'answers.option',
    //     ])
    //         ->where('student_id', Auth::id())
    //         ->where('assessment_id', $request->assessment)
    //         ->first();

    //     return Inertia::render(
    //         "student/classroom/subject/assessment/attempt/Review",
    //         ['assessmentAttempt' => $assessmentAttempt]
    //     );
    // }


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


    public function check($class, $subject, $assessment, $student)
    {
        return Inertia::render('instructor.classroom.subject.assessment.student.index');
    }
}
