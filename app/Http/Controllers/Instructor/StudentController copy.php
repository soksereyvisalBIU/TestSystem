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
        $validated = $request->validate([
            'student_assessment_attempt_id' => 'required|integer'
        ]);

        Log::info($request->all());

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

        Log::info("Total Score: " . $total_score);

        return redirect()->back()->with('success', 'Assessment scored successfully.');
    }


    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'scores' => 'required|array',
    //         'scores.*' => 'nullable|numeric',
    //     ]);

    //     $attempt_id = $request->attempt_id;
    //     $scores = $request->scores;

    //     $total_scores = 0;

    //     foreach ($validated['scores'] as $answerId => $points) {
    //         AssessmentAnswer::where('id', $answerId)
    //             ->update(['points_earned' => $points]);
    //         $total_scores += $points;
    //     }

    //     $assessmentAttempt = AssessmentAttempt::with(['assessment', 'answers.question', 'answers.option'])->findOrFail($attempt_id);


    //     // dd($assessmentAttempt);
    //     // $assessmentAttempt = AssessmentAttempt::with(['assessment', 'answers.question', 'answers.option'])->first();

    //     // Update the score in the database
    //     $assessmentAttempt->update(['score' => $total_scores]);

    //     // Reload the model to get the latest data
    //     $assessmentAttempt->refresh();

    //     // Try broadcasting score update
    //     try {
    //         broadcast(new ScoreUpdated($assessmentAttempt))->toOthers();
    //     } catch (\Exception $e) {
    //         Log::error("Broadcast ScoreUpdated failed: " . $e->getMessage());
    //     }

    //     // Try broadcasting course update
    //     // try {
    //     //     $course = $assessmentAttempt->assessment->course;
    //     //     broadcast(new CourseUpdated($course, "Your course has updates!"))->toOthers();
    //     // } catch (\Exception $e) {
    //     //     Log::error("Broadcast CourseUpdated failed: " . $e->getMessage());
    //     // }

    //     // $course = $assessmentAttempt->assessment->course;
    //     try {
    //         Notification::send($assessmentAttempt->student, new SystemNotification("Your score has been updated to {$assessmentAttempt->score} on {$assessmentAttempt->assessment->title} assessment"));
    //     } catch (\Exception $e) {
    //         Log::error("" . $e->getMessage());
    //     }

    //     return redirect()->back()->with('success', 'Scores updated');
    // }


    /**
     * Display the specified resource.
     */
    public function show($class, $subject, $assessmentId, $studentId)
    {
        // 1. Fetch with specific constraints to reduce memory usage
        $assessment = Assessment::select('id', 'title')
            ->with(['questions' => function ($q) {
                $q->select('id', 'assessment_id', 'question_text', 'type', 'point', 'order')
                    ->orderBy('order')
                    ->with(['options:id,question_id,option_text,is_correct']);
            }])
            ->findOrFail($assessmentId);

        // 2. Fetch the attempt with its specific student and answers
        // We use whereHas to ensure the student actually belongs to this assessment
        $attempt = StudentAssessmentAttempt::whereHas('studentAssessment', function ($query) use ($assessmentId, $studentId) {
            $query->where('assessment_id', $assessmentId)
                ->where('user_id', $studentId);
        })
            ->with([
                'student:name',
                'answers:id,student_assessment_attempt_id,question_id,answer_text,option_id,points_earned'
            ])
            ->latest()
            ->firstOrFail();

        $answersByQuestion = $attempt->answers->keyBy('question_id');

        // 3. Transformation: Add context for the instructor (e.g., correct answer text)
        $formattedQuestions = $assessment->questions->map(function ($question) use ($answersByQuestion) {
            $answer = $answersByQuestion->get($question->id);

            return [
                'id'    => $question->id,
                'text'  => $question->question_text,
                'type'  => $question->type,
                'point' => (float) $question->point,
                // Ensure options is always an array, never null
                'options' => $question->options ?? [],
                'student_answer' => $answer ? [
                    'id'            => $answer->id,
                    'answer_text'   => $answer->answer_text,
                    'option_id'     => $answer->option_id,
                    'points_earned' => (float) $answer->points_earned,
                ] : null,
            ];
        });

        return Inertia::render('instructor/classroom/subject/assessment/student/Show', [
            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'questions_data' => $formattedQuestions
            ],
            'attempt' => $attempt
        ]);
    }

    /**
     * Helper to determine what text to show for the answer
     */
    private function resolveAnswerText($question, $answer)
    {
        if ($question->type === 'multiple_choice' || $question->type === 'true_false') {
            return $question->options->where('id', $answer->option_id)->first()?->option_text;
        }
        return $answer->answer_text;
    }


    /**
     * Save manual scores (authoritative)
     */
    public function updateScores(Request $request)
    {
        $validated = $request->validate([
            'attempt_id'              => 'required|exists:student_assessment_attempts,id',
            'scores'                  => 'required|array',
            'scores.*.question_id'    => 'required|exists:questions,id',
            'scores.*.points_earned'  => 'nullable|numeric|min:0',
        ]);

        $attempt = StudentAssessmentAttempt::with('answers')
            ->findOrFail($validated['attempt_id']);

        foreach ($validated['scores'] as $item) {
            $attempt->answers()
                ->where('question_id', $item['question_id'])
                ->update([
                    'points_earned' => $item['points_earned'],
                ]);
        }

        // Recalculate total score (server truth)
        $attempt->sub_score = $attempt->answers()->sum('points_earned');
        $attempt->save();

        return back()->with('success', 'Scores updated');
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
