<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\Student\QuestionResource;
use App\Http\Resources\Student\StudentAssessmentAttemptResource;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\Question;
use App\Models\StudentAssessment;
use App\Models\StudentAssessmentAttempt;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AttemptController extends Controller
{
    public function attempt(Request $request, $class_id, $subject_id, $assessment_id)
    {
        $student_assessment_id = $request->input('student_assessment_id');
        $student_assessment_attempt_id = $request->input('student_assessment_attempt_id');

        $assessment = Assessment::with('subjects')
            ->findOrFail($assessment_id);

        $questions = QuestionResource::collection(
            Question::with('options')
                ->where('assessment_id', $assessment_id)
                ->orderBy('order')
                ->get()
        );

        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Index',
            compact('assessment', 'questions', 'student_assessment_attempt_id')
        );
    }

    public function store(Request $request, $class_id, $subject_id, $assessment_id)
    {
        Log::info($request->all());
        Log::info($request->student_assessment_attempt_id);

        // Load active attempt
        $assessmentAttempt = StudentAssessmentAttempt::findOrFail(
            $request->student_assessment_attempt_id
        );

        // Mark as submitted
        $assessmentAttempt->update([
            'submitted_at' => now(),
            'status'       => 'submitted',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Save Answers
        |--------------------------------------------------------------------------
        */

        foreach ($request->answers as $questionId => $answer) {

            /*
            |-------------------------------
            | A. MATCHING QUESTION
            | Structure: [ optionId => answerText ]
            |-------------------------------
            */
            if (is_array($answer) && !array_is_list($answer) && !isset($answer['text'])) {

                foreach ($answer as $optionId => $text) {
                    Answer::create([
                        'student_assessment_attempt_id' => $assessmentAttempt->id,
                        'question_id'                   => $questionId,
                        'option_id'                     => $optionId,
                        'answer_text'                   => $text,
                    ]);
                }

                continue;
            }

            /*
            |-------------------------------
            | B. SHORT ANSWER
            | Structure: { text: "..." }
            |-------------------------------
            */
            if (is_array($answer) && isset($answer['text'])) {

                Answer::create([
                    'student_assessment_attempt_id' => $assessmentAttempt->id,
                    'question_id'                   => $questionId,
                    'option_id'                     => null,
                    'answer_text'                   => $answer['text'],
                ]);

                continue;
            }

            /*
            |-------------------------------
            | C. TRUE/FALSE or MULTIPLE CHOICE
            | Numeric → option_id
            | String  → answer_text
            |-------------------------------
            */
            Answer::create([
                'student_assessment_attempt_id' => $assessmentAttempt->id,
                'question_id'                   => $questionId,
                'option_id'                     => is_numeric($answer) ? $answer : null,
                'answer_text'                   => is_numeric($answer) ? null : $answer,
            ]);
        }
    }

    public function review(Request $request){

        $assessmentAttempt = StudentAssessmentAttempt::with('studentAssessment' , 'assessment.questions' , 'answers')->where('id', $request->student_assessment_attempt_id)->first();

        // $assessmentAttemptResource = new \App\Http\Resources\Student\AssessmentResource(Assessment::with('questions' , 'answer')->findOrFail($request->student_assessment_attempt_id));

        $assessmentAttemptResource = new StudentAssessmentAttemptResource(StudentAssessmentAttempt::with('studentAssessment' , 'assessment.questions' , 'answers')->findOrFail($request->student_assessment_attempt_id));

        // dd($assessmentAttemptResource);

        // return response()->json($assessmentAttemptResource); 
        return Inertia::render('student/classroom/subject/assessment/attempt/Review' , compact('assessmentAttempt' , 'assessmentAttemptResource'));
    }
}
