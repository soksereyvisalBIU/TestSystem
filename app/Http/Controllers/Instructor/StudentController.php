<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Instructor\AssessmentResource;
use App\Http\Resources\Student\StudentAssessmentAttemptResource;
use App\Models\Assessment;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use function Illuminate\Log\log;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($classId, $subjectId, $assessment_id)
    {
        $assessment = (new AssessmentResource(
            Assessment::with('students')->findOrFail($assessment_id)
        ))->resolve();

        // return response()->json($assessment);

        return Inertia::render('instructor/classroom/subject/assessment/student/Index' , compact('assessment', ));
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
        $validated = $request->validate([
            'student_assessment_attempt_id' => 'required|integer'
        ]);

        // Log::info($request->all());

        $total_score = 0;

        // Always load the attempt
        $studentAssessmentAttempt = StudentAssessmentAttempt::findOrFail(
            $validated['student_assessment_attempt_id']
        );

        if ($request->answers) {

            // Load related answers
            $answers = $studentAssessmentAttempt->answers;
            Log::info($answers);

            foreach ($request->answers as $answer) {

                // Find the specific student's answer record
                $answerModel = $answers->firstWhere('question_id', $answer['question_id']);

                if ($answerModel) {
                    // Update points_earned
                    $answerModel->update([
                        'points_earned' => $answer['score']
                    ]);

                    // Add to total score
                    $total_score += $answer['score'];
                }
            }
        }

        // Update attempt
        $studentAssessmentAttempt->update([
            'status' => "scored",
            'sub_score' => $total_score
        ]);

        // Update parent assessment
        $studentAssessmentAttempt->studentAssessment()->update([
            'status' => 'scored',
            'score' => $total_score
        ]);

        // Log::info("Total Score: " . $total_score);

        return redirect()->back()->with('success', 'Assessment scored successfully.');
    }


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
        $attempt = $studentAssessment->attempts()
            ->with('answers.answerFiles')
            ->whereIn('status', ['submitted', 'scored'])
            ->latest()
            ->first();

        

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
