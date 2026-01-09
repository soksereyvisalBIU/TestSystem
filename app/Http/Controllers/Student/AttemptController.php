<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\QuestionResource;
use App\Http\Resources\Student\StudentAssessmentAttemptResource;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // ✅ ADD THIS

class AttemptController extends Controller
{
    use AuthorizesRequests; // ✅ ADD THIS 
    /**
     * Show attempt page
     */
    public function attempt(Request $request, $class_id, $subject_id, $assessment_id)
    {
        $studentAssessmentAttempt = StudentAssessmentAttempt::with('studentAssessment')
            ->findOrFail($request->student_assessment_attempt_id);

        // 🔐 POLICY CHECK
        $this->authorize('attempt', $studentAssessmentAttempt);

        $assessment = Assessment::with('subjects')->findOrFail($assessment_id);

        $questions = QuestionResource::collection(
            Question::with(['options', 'submissionSetting', 'media'])
                ->where('assessment_id', $assessment_id)
                ->orderBy('order')
                ->get()
        );



        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Index',
            [
                'assessment' => $assessment,
                'questions' => $questions,
                'student_assessment_attempt_id' => $studentAssessmentAttempt->id,
                'studentAssessmentAttempt' => $studentAssessmentAttempt,
            ]
        );
    }

    /**
     * Submit attempt
     */
    public function store(Request $request, $class_id, $subject_id, $assessment_id)
    {
        
        
        $assessmentAttempt = StudentAssessmentAttempt::with('studentAssessment')
            ->findOrFail($request->student_assessment_attempt_id);

        // 🔐 POLICY CHECK
        $this->authorize('attempt', $assessmentAttempt);

        if ($assessmentAttempt->status === 'submitted') {
            return back()->with('error', 'This attempt has already been submitted.');
        }

        // Mark as submitted
        $assessmentAttempt->update([
            'completed_at' => now(),
            'status'       => 'submitted',
        ]);

        // Increment attempt count
        $assessmentAttempt->studentAssessment->increment('attempted_amount');
        $assessmentAttempt->studentAssessment()->update([
            'status' => 'submitted',
        ]);

        // ===============================
        // Save Answers (Text / MCQ / File)
        // ===============================
        foreach ($request->answers as $questionId => $answer) {

            /*
        |--------------------------------------------------------------------------
        | FILE ANSWER
        |--------------------------------------------------------------------------
        */
            if ($answer instanceof \Illuminate\Http\UploadedFile) {

                // Create empty answer first
                $answerModel = Answer::create([
                    'student_assessment_attempt_id' => $assessmentAttempt->id,
                    'question_id' => $questionId,
                ]);

                // Store file
                $path = $answer->store(
                    'answers/' . $assessmentAttempt->id,
                    'public'
                );

                // Save file record
                $answerModel->answerFiles()->create([
                    'file_path'  => $path,
                    // 'uploaded_at' => now(),
                ]);

                continue;
            }

            /*
        |--------------------------------------------------------------------------
        | MATCHING QUESTION
        |--------------------------------------------------------------------------
        */
            if (is_array($answer) && !array_is_list($answer) && !isset($answer['text'])) {
                foreach ($answer as $optionId => $text) {
                    Answer::create([
                        'student_assessment_attempt_id' => $assessmentAttempt->id,
                        'question_id' => $questionId,
                        'option_id' => $optionId,
                        'answer_text' => $text,
                    ]);
                }
                continue;
            }

            /*
        |--------------------------------------------------------------------------
        | SHORT ANSWER
        |--------------------------------------------------------------------------
        */
            if (is_array($answer) && isset($answer['text'])) {
                Answer::create([
                    'student_assessment_attempt_id' => $assessmentAttempt->id,
                    'question_id' => $questionId,
                    'answer_text' => $answer['text'],
                ]);
                continue;
            }

            /*
        |--------------------------------------------------------------------------
        | MCQ / TRUE-FALSE
        |--------------------------------------------------------------------------
        */
            Answer::create([
                'student_assessment_attempt_id' => $assessmentAttempt->id,
                'question_id' => $questionId,
                'option_id' => is_numeric($answer) ? $answer : null,
                'answer_text' => is_numeric($answer) ? null : $answer,
            ]);
        }

        return redirect()
            ->route('student.classes.subjects.assessments.show', [
                'class' => $class_id,
                'subject' => $subject_id,
                'assessment' => $assessment_id,
            ])
            ->with('success', 'Assessment submitted successfully!');
    }


    /**
     * Review submitted attempt
     */
    public function review(Request $request)
    {
        $attempt = StudentAssessmentAttempt::with([
            'studentAssessment',
            'assessment.questions.options',
            'assessment.questions.submissionSetting',
            'assessment.questions.media',
            'answers',
        ])->findOrFail($request->student_assessment_attempt_id);

        // 🔐 POLICY CHECK
        $this->authorize('review', $attempt);

        $assessmentAttemptResource = new StudentAssessmentAttemptResource($attempt);

        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Review',
            compact('assessmentAttemptResource')
        );
    }
}
