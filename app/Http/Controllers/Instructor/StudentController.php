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
use Illuminate\Support\Facades\DB;
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
    public function autoScore($class, $subject, $assessmentId)
    {
        // Log::info("🚀 AutoScore START", compact('class', 'subject', 'assessmentId'));

        $assessment = Assessment::with('questions.options')->findOrFail($assessmentId);

        // Speed optimization: Check for manual types using the pre-loaded collection
        $manualTypes = ['fill_blank', 'short_answer', 'fileupload'];
        if ($assessment->questions->whereIn('type', $manualTypes)->isNotEmpty()) {
            return back()->with('error', 'Manual grading required.');
        }

        $studentAssessments = StudentAssessment::where('assessment_id', $assessmentId)->get();

        // PERFORMANCE: Fetch the latest attempt for every student assessment in ONE query
        // We remove the 'status' = 'submitted' filter here to ensure we actually find the records
        $attemptsMap = StudentAssessmentAttempt::with('answers')
            ->whereIn('student_assessment_id', $studentAssessments->pluck('id'))
            ->latest()
            ->get()
            ->groupBy('student_assessment_id');

        DB::beginTransaction();
        try {
            foreach ($studentAssessments as $studentAssessment) {
                // Get the most recent attempt
                $attempt = $attemptsMap->get($studentAssessment->id)?->first();

                // If no attempt exists, we still want to mark the parent as 'scored' (0) 
                // or keep it as 'submitted'. Here we skip to avoid logic errors.
                if (!$attempt) {
                    Log::warning("No attempt for SA ID: {$studentAssessment->id}");
                    continue;
                }

                $totalScore = 0;
                $answersByQuestion = $attempt->answers->groupBy('question_id');

                foreach ($assessment->questions as $question) {
                    $questionAnswers = $answersByQuestion->get($question->id, collect());
                    $earnedPoints = $this->calculateAutoScore($question, $questionAnswers);

                    // Batch update points for answers
                    foreach ($questionAnswers as $ans) {
                        $ans->points_earned = $earnedPoints;
                        $ans->save();
                    }
                    $totalScore += $earnedPoints;
                }

                // UPDATE ATTEMPT STATUS
                $attempt->update([
                    'status' => 'scored',
                    'sub_score' => $totalScore
                ]);

                // UPDATE PARENT ASSESSMENT STATUS (This was missing/skipped in your log)
                $studentAssessment->update([
                    'status' => 'scored',
                    'score' => $totalScore
                ]);

                // Log::info("✅ Scored SA ID: {$studentAssessment->id} - Score: {$totalScore}");
            }

            DB::commit();
            // Log::info("🎉 AutoScore COMPLETED");
            return back()->with('success', 'Scoring complete.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log::error("❌ AutoScore Error: " . $e->getMessage());
            return back()->with('error', 'Scoring failed.');
        }
    }

    // public function autoScore($class, $subject, $assessmentId)
    // {
    //     Log::info("🚀 AutoScore START", compact('class', 'subject', 'assessmentId'));

    //     // 1. Eager load questions and options upfront
    //     $assessment = Assessment::with('questions.options')->findOrFail($assessmentId);

    //     // Check manual questions using the loaded collection (no extra DB query)
    //     $manualTypes = ['fill_blank', 'short_answer', 'fileupload'];
    //     if ($assessment->questions->whereIn('type', $manualTypes)->isNotEmpty()) {
    //         Log::warning("⛔ AutoScore aborted - Manual grading required");
    //         return back()->with('error', 'This assessment requires manual grading.');
    //     }

    //     // 2. Fetch all student assessments
    //     $studentAssessments = StudentAssessment::where('assessment_id', $assessmentId)->get();

    //     if ($studentAssessments->isEmpty()) {
    //         return back()->with('info', 'No students found for this assessment.');
    //     }

    //     // 3. EAGER LOAD all submitted attempts and their answers in ONE query (Massive latency reduction)
    //     $attemptsMap = StudentAssessmentAttempt::with('answers')
    //         ->whereIn('student_assessment_id', $studentAssessments->pluck('id'))
    //         ->where('status', 'submitted')
    //         ->latest()
    //         ->get()
    //         ->groupBy('student_assessment_id');

    //     // 4. Wrap database updates in a transaction for speed and data integrity
    //     DB::beginTransaction();
    //     try {
    //         foreach ($studentAssessments as $studentAssessment) {

    //             // Get the latest attempt from our pre-loaded map
    //             $attempt = $attemptsMap->get($studentAssessment->id)?->first();

    //             if (!$attempt) {
    //                 continue;
    //             }

    //             $totalScore = 0;

    //             // Group answers by question_id for instant O(1) lookups
    //             $answersByQuestion = $attempt->answers->groupBy('question_id');

    //             foreach ($assessment->questions as $question) {
    //                 // Get answers for this specific question, or an empty collection
    //                 $questionAnswers = $answersByQuestion->get($question->id, collect());

    //                 $earnedPoints = $this->calculateAutoScore($question, $questionAnswers);

    //                 // Update each answer
    //                 foreach ($questionAnswers as $ans) {
    //                     $ans->update(['points_earned' => $earnedPoints]);
    //                 }

    //                 $totalScore += $earnedPoints;
    //             }

    //             // Update Attempt & StudentAssessment models
    //             $attempt->update([
    //                 'status' => 'scored',
    //                 'sub_score' => $totalScore
    //             ]);

    //             $studentAssessment->update([
    //                 'status' => 'scored',
    //                 'score' => $totalScore
    //             ]);
    //         }

    //         DB::commit(); // Commit all updates simultaneously
    //         Log::info("🎉 AutoScore COMPLETED");

    //         Log::info($studentAssessments);

    //         return back()->with('success', 'All students auto-scored successfully.');
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error("🔥 AutoScore FAILED", ['error' => $e->getMessage()]);
    //         return back()->with('error', 'An error occurred during auto-scoring.');
    //     }
    // }

    private function calculateAutoScore($question, $answers)
    {
        $maxPoints = (float) ($question->point ?? 0);

        // Fast exit if no answers provided
        if ($answers->isEmpty()) {
            return 0;
        }

        /*
    |--------------------------------------------------------------------------
    | TRUE / FALSE
    |--------------------------------------------------------------------------
    */
        if ($question->type === 'true_false') {
            $studentAnswer = $answers->first()->answer_text;
            if (!$studentAnswer) return 0;

            $correctOption = $question->options->firstWhere('is_correct', 1);
            if (!$correctOption) return 0;

            // BUG FIX: Your log showed $correctOption->text was returning null. 
            // We now fallback to other common column names, or you can hardcode your exact column name here.
            $correctValue = $correctOption->text ?? $correctOption->option_text ?? $correctOption->title ?? $correctOption->value;

            if (strtolower(trim((string) $studentAnswer)) === strtolower(trim((string) $correctValue))) {
                return $maxPoints;
            }
            return 0;
        }

        /*
    |--------------------------------------------------------------------------
    | MULTIPLE CHOICE
    |--------------------------------------------------------------------------
    */
        if ($question->type === 'multiple_choice') {
            // Since we eager loaded options, pluck directly from the collection
            $correctOptionIds = $question->options->where('is_correct', 1)->pluck('id')->sort()->values()->toArray();
            $selectedOptionIds = $answers->pluck('option_id')->filter()->sort()->values()->toArray();

            if (!empty($correctOptionIds) && $correctOptionIds === $selectedOptionIds) {
                return $maxPoints;
            }
            return 0;
        }

        return 0;
    }

    // public function autoScoreIfNoManual($assessmentId)
    // {
    //     $assessment = Assessment::with([
    //         'questions.options',
    //         'studentAssessments.attempts.answers'
    //     ])->findOrFail($assessmentId);

    //     $manualTypes = ['fill_blank', 'short_answer', 'fileupload'];

    //     // 1️⃣ Check if manual grading is needed
    //     $hasManualQuestions = $assessment->questions()
    //         ->whereIn('type', $manualTypes)
    //         ->exists();

    //     if ($hasManualQuestions) {
    //         return response()->json([
    //             'message' => 'Assessment requires manual grading.'
    //         ]);
    //     }

    //     // 2️⃣ Loop through all submitted attempts
    //     foreach ($assessment->studentAssessments as $studentAssessment) {

    //         $attempt = $studentAssessment->attempts()
    //             ->where('status', 'submitted')
    //             ->latest()
    //             ->first();

    //         if (!$attempt) {
    //             continue;
    //         }

    //         $totalScore = 0;

    //         foreach ($assessment->questions as $question) {

    //             $answers = $attempt->answers
    //                 ->where('question_id', $question->id);

    //             $earnedPoints = $this->calculateAutoScoreBackend($question, $answers);

    //             $totalScore += $earnedPoints;
    //         }

    //         // 3️⃣ Update attempt
    //         $attempt->update([
    //             'sub_score' => $totalScore,
    //             'status' => 'scored'
    //         ]);

    //         $attempt->studentAssessment()->update([
    //             'status' => 'scored',
    //             'score' => $totalScore
    //         ]);
    //     }

    //     return response()->json([
    //         'message' => 'All students auto-scored successfully.'
    //     ]);
    // }

    // public function autoScore($class, $subject, $assessmentId)
    // {
    //     Log::info("🚀 AutoScore START", [
    //         'class' => $class,
    //         'subject' => $subject,
    //         'assessment_id' => $assessmentId
    //     ]);

    //     $assessment = Assessment::with('questions.options')
    //         ->findOrFail($assessmentId);

    //     Log::info("📘 Assessment Loaded", [
    //         'assessment_id' => $assessment->id,
    //         'total_questions' => $assessment->questions->count()
    //     ]);

    //     $manualTypes = ['fill_blank', 'short_answer', 'fileupload'];

    //     // 1️⃣ Check if manual grading is required
    //     $hasManualQuestions = $assessment->questions()
    //         ->whereIn('type', $manualTypes)
    //         ->exists();

    //     Log::info("🔎 Manual Question Check", [
    //         'has_manual_questions' => $hasManualQuestions
    //     ]);

    //     if ($hasManualQuestions) {
    //         Log::warning("⛔ AutoScore aborted - Manual grading required");
    //         return back()->with('error', 'This assessment requires manual grading.');
    //     }

    //     // 2️⃣ Get all student assessments
    //     $studentAssessments = StudentAssessment::where('assessment_id', $assessmentId)
    //         ->get();

    //     Log::info("👨‍🎓 Student Assessments Found", [
    //         'count' => $studentAssessments->count()
    //     ]);

    //     foreach ($studentAssessments as $studentAssessment) {

    //         Log::info("➡ Processing StudentAssessment", [
    //             'student_assessment_id' => $studentAssessment->id,
    //             'student_id' => $studentAssessment->user_id ?? null
    //         ]);

    //         // Get latest submitted attempt
    //         $attempt = StudentAssessmentAttempt::where('student_assessment_id', $studentAssessment->id)
    //             ->where('status', 'submitted')
    //             ->latest()
    //             ->first();

    //         if (!$attempt) {
    //             Log::warning("⚠ No submitted attempt found", [
    //                 'student_assessment_id' => $studentAssessment->id
    //             ]);
    //             continue;
    //         }

    //         Log::info("📝 Attempt Found", [
    //             'attempt_id' => $attempt->id,
    //             'status' => $attempt->status
    //         ]);

    //         $totalScore = 0;

    //         $answers = $attempt->answers;

    //         Log::info("🔍 Answers Debug", [
    //             'answers' => $answers
    //         ]);

    //         Log::info("📦 Answers Loaded", [
    //             'total_answers' => $answers->count()
    //         ]);

    //         foreach ($assessment->questions as $question) {

    //             Log::info("❓ Processing Question", [
    //                 'question_id' => $question->id,
    //                 'type' => $question->type,
    //                 'max_point' => $question->point
    //             ]);

    //             $questionAnswers = $answers->where('question_id', $question->id);

    //             Log::info("📌 Question Answers Found", [
    //                 'count' => $questionAnswers->count()
    //             ]);

    //             $earnedPoints = $this->calculateAutoScore($question, $questionAnswers);

    //             Log::info("🔍 Answers Debug", [
    //                 'questions answer key' => $question->answers
    //             ]);

    //             Log::info("✅ Earned Points Calculated", [
    //                 'question_id' => $question->id,
    //                 'earned_points' => $earnedPoints
    //             ]);

    //             // Update each answer points_earned
    //             foreach ($questionAnswers as $ans) {
    //                 $ans->update([
    //                     'points_earned' => $earnedPoints
    //                 ]);

    //                 Log::info("💾 Answer Updated", [
    //                     'answer_id' => $ans->id,
    //                     'points_earned' => $earnedPoints
    //                 ]);
    //             }

    //             $totalScore += $earnedPoints;
    //         }

    //         Log::info("🧮 Total Score Calculated", [
    //             'attempt_id' => $attempt->id,
    //             'total_score' => $totalScore
    //         ]);

    //         // Update attempt
    //         $attempt->update([
    //             'status' => 'scored',
    //             'sub_score' => $totalScore
    //         ]);

    //         Log::info("📝 Attempt Updated", [
    //             'attempt_id' => $attempt->id,
    //             'new_status' => 'scored',
    //             'sub_score' => $totalScore
    //         ]);

    //         // Update parent StudentAssessment
    //         $studentAssessment->update([
    //             'status' => 'scored',
    //             'score' => $totalScore
    //         ]);

    //         Log::info("📊 StudentAssessment Updated", [
    //             'student_assessment_id' => $studentAssessment->id,
    //             'score' => $totalScore
    //         ]);
    //     }

    //     Log::info("🎉 AutoScore COMPLETED");

    //     return back()->with('success', 'All students auto-scored successfully.');
    // }

    // private function calculateAutoScore($question, $answers)
    // {
    //     $maxPoints = floatval($question->point ?? 0);

    //     Log::info("🔢 calculateAutoScore START", [
    //         'question_id' => $question->id,
    //         'type' => $question->type,
    //         'max_points' => $maxPoints
    //     ]);

    //     /*
    // |--------------------------------------------------------------------------
    // | TRUE / FALSE
    // |--------------------------------------------------------------------------
    // */
    //     if ($question->type === 'true_false') {

    //         $studentAnswer = $answers->first()?->answer_text;

    //         if (!$studentAnswer) {
    //             Log::warning("⚠ No student answer found", [
    //                 'question_id' => $question->id
    //             ]);
    //             return 0;
    //         }

    //         // Make sure options are loaded
    //         if (!$question->relationLoaded('options')) {
    //             $question->load('options');
    //         }

    //         $correctOption = $question->options->firstWhere('is_correct', 1);

    //         if (!$correctOption) {
    //             Log::error("❌ No correct option configured in DB", [
    //                 'question_id' => $question->id
    //             ]);
    //             return 0;
    //         }

    //         // Change 'text' if your column name is different
    //         $correctValue = $correctOption->text;

    //         Log::info("📊 True/False Comparison", [
    //             'correct' => $correctValue,
    //             'student' => $studentAnswer
    //         ]);

    //         if (strtolower(trim($studentAnswer)) === strtolower(trim($correctValue))) {
    //             Log::info("✅ True/False Correct");
    //             return $maxPoints;
    //         }

    //         Log::info("❌ True/False Incorrect");
    //         return 0;
    //     }

    //     /*
    // |--------------------------------------------------------------------------
    // | MULTIPLE CHOICE
    // |--------------------------------------------------------------------------
    // */
    //     if ($question->type === 'multiple_choice') {

    //         if (!$question->relationLoaded('options')) {
    //             $question->load('options');
    //         }

    //         $correctOptionIds = $question->options
    //             ->where('is_correct', 1)
    //             ->pluck('id')
    //             ->toArray();

    //         $selectedOptionIds = $answers
    //             ->pluck('option_id')
    //             ->filter()
    //             ->toArray();

    //         sort($correctOptionIds);
    //         sort($selectedOptionIds);

    //         Log::info("📊 MCQ Comparison", [
    //             'correct_ids' => $correctOptionIds,
    //             'selected_ids' => $selectedOptionIds
    //         ]);

    //         if ($correctOptionIds === $selectedOptionIds) {
    //             Log::info("✅ MCQ Correct");
    //             return $maxPoints;
    //         }

    //         Log::info("❌ MCQ Incorrect");
    //         return 0;
    //     }

    //     /*
    // |--------------------------------------------------------------------------
    // | DEFAULT
    // |--------------------------------------------------------------------------
    // */
    //     Log::info("⚠ Question type not supported for auto-score", [
    //         'type' => $question->type
    //     ]);

    //     return 0;
    // }

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










// Nielsen Audio Ratings	372
// Average Quarter-Hour	373
// Cume	375
// Time Spent Listening	375
// Music and Format Selection	378
// Researching a Market	378
// In-Depth Format Analysis	381
// Selling the Target Demographic	381
// Strategy and Tactics	383
// The Program Director’s Duties	384
// Music Mix and Rotation	384
// Program Elements	385
// Selecting a Promotional Voice	386
// Formatics and Inventory Control	387
// Comparison Shopping a Format	387
// Coordinating All of the Program Elements	388
