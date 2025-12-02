<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssessmentResource;
use App\Http\Resources\Student\QuestionResource;
use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttemptController extends Controller
{
    public function attempt(Request $request, $class_id, $subject_id, $assessment_id)
    {
        // dd($request->all());

        $assessment = Assessment::findOrFail($assessment_id);

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
}
