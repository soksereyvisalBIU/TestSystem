<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\Student\QuestionResource;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\Question;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AttemptController extends Controller
{
    public function attempt(Request $request, $class_id, $subject_id, $assessment_id)
    {
        // dd($request->all());

        $assessment = Assessment::with('subjects')->findOrFail($assessment_id);

        $questions = QuestionResource::collection(Question::with('options')->where('assessment_id', $assessment_id)->orderBy('order')->get());


        // $assessment = AssessmentResource::with('questions.options')->findOrFail

        // dd($assessment);

        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Index',
            compact('assessment', 'questions')
        );


        // $validated = $request->validate([
        //     'token' => 'required|string',
        //     'student_id' => 'required|exists:users,id', // assuming you’re passing this
        // ]);

        // // Verify that the token belongs to this student and assessment
        // $attempt = AssessmentAttempt::with('assessment')->where('token', $validated['token'])
        //     ->where('user_id', $validated['student_id'])
        //     ->where('assessment_id', $assessment_id)
        //     ->first();

        // $questions = QuestionResource::collection(Question::with('options')->where('assessment_id', $assessment_id)->orderBy('order')->get());

        // if (!$attempt) {
        //     return abort(403, 'Unauthorized or invalid assessment attempt.');
        // }

        // // ✅ Authorized — show the assessment
        // return Inertia::render('student/courses/assessments/attempt/Index', [
        //     'attempt' => $attempt,
        //     'questions' => $questions,
        //     'assessment_id' => $assessment_id,
        //     'course_id' => $course_id

        // ]);
    }

    public function store(Request $request, $class_id, $subject_id, $assessment_id)
    {

        // "answers" => array:6 [▼
        //     1 => "adsf"
        //     2 => "True"
        //     3 => array:5 [▼
        //       34 => "array"
        //       35 => "variable"
        //       36 => "c++"
        //       37 => "pointer"
        //       38 => "data"
        //     ]
        //     4 => array:2 [▼
        //       "id" => 40
        //       "text" => "hello"
        //     ]
        //     5 => "adsfadsf"
        //     6 => "False"
        //   ]
        //   "user_id" => 4

        // Optional validation
        Log::info($request->all());

        // dd($request->all());

        // Load active attempt
        // $assessmentAttempt = StudentAssessmentAttempt::findOrFail($request->attempt_id);
        // // 'student_assesment_id',
        // // 'status',
        // // 'started_at',
        // // 'completed_at',
        // // 'sub_score',
        // // Save attempt (in case you increment something later)
        // $assessmentAttempt->save();

        // // Mark submitted
        // $assessmentAttempt->update([
        //     'submitted_at' => now(),
        //     'score'        => null,
        //     'status'       => 'submitted',
        // ]);

        /*
    |--------------------------------------------------------------------------
    | SAVE ANSWERS
    |--------------------------------------------------------------------------
    */
        foreach ($request->answers as $question_id => $answer) {

            // ---------------------------------------------------------
            // CASE A — MATCHING QUESTION ( [ left_id => right_id ] )
            // ---------------------------------------------------------
            if (is_array($answer) && array_is_list($answer) === false && !isset($answer['text'])) {
                foreach ($answer as $leftId => $rightId) {
                    Answer::create([
                        'attempt_id'          => $assessmentAttempt->id,
                        'question_id'         => $question_id,
                        'option_id'  => $rightId,
                        'matching_id'         => $leftId,
                        'answer_text'         => null,
                    ]);
                }
                continue;
            }

            // ---------------------------------------------------------
            // CASE B — SHORT ANSWER ({id: x, text: "..."} )
            // ---------------------------------------------------------
            if (is_array($answer) && isset($answer['text'])) {
                Answer::create([
                    'attempt_id'          => $assessmentAttempt->id,
                    'question_id'         => $question_id,
                    'option_id'  => null,
                    'answer_text'         => $answer['text'],
                ]);
                continue;
            }

            // ---------------------------------------------------------
            // CASE C — TRUE/FALSE or MULTIPLE CHOICE
            // ---------------------------------------------------------
            Answer::create([
                'attempt_id'          => $assessmentAttempt->id,
                'question_id'         => $question_id,
                'option_id'  => is_numeric($answer) ? $answer : null,
                'answer_text'         => !is_numeric($answer) ? $answer : null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Assessment submitted successfully.',
            'attempt_id' => $assessmentAttempt->id,
            'status' => 'submitted',
            'submitted_at' => $assessmentAttempt->submitted_at,
        ], 200);


        // dd($request->all());
    }
}
