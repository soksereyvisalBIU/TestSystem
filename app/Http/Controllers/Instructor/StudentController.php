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
        // $assessment = (new AssessmentResource(
        //     Assessment::with('studentAssessmentAttempts')->findOrFail($assessment_id)
        // ))->resolve();
        $assessment = Assessment::with('studentAssessmentAttempts')->findOrFail($assessment_id);


        return Inertia::render('instructor/classroom/subject/assessment/student/Index', compact('assessment', 'classId', 'subjectId'));
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


    // public function show($class, $subject, $assessment, $id)
    // {
    //     $assessmentId = $assessment;
    //     // Get the assessment (validate)
    //     $assessment = Assessment::with('questions.options')->findOrFail($assessmentId);

    //     // Get the student's assessment row
    //     $studentAssessment = StudentAssessment::with('student')->where('assessment_id', $assessmentId)
    //         ->where('user_id', $id)
    //         ->firstOrFail();


    //     // Get the latest attempt
    //     $attempt = $studentAssessment->attempts()
    //         ->with('answers.answerFiles')
    //         ->whereIn('status', ['submitted', 'scored'])
    //         ->latest()
    //         ->first();



    //     return Inertia::render('instructor/classroom/subject/assessment/student/Show', compact('attempt', 'assessment'));
    // }

    public function show($class, $subject, $assessment, $id)
    {
        $assessmentId = $assessment;

        // Load assessment with questions & options
        $assessment = Assessment::with('questions.options')
            ->findOrFail($assessmentId);

        // Get student assessment row
        $studentAssessment = StudentAssessment::with('student')
            ->where('assessment_id', $assessmentId)
            ->where('user_id', $id)
            ->firstOrFail();

        // Get latest submitted/scored attempt
        $attempt = $studentAssessment->attempts()
            ->with([
                'answers.answerFiles',
                'student', // ensure student relation available
            ])
            ->whereIn('status', ['submitted', 'scored'])
            ->latest()
            ->firstOrFail(); // safer

        return Inertia::render(
            'instructor/classroom/subject/assessment/student/Show',
            [
                'assessment' => $assessment,
                'attempt' => $attempt,
                'student' => $studentAssessment->student,
                'classId' => $class,
                'subjectId' => $subject,
            ]
        );
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
