<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\QuestionResource;
use App\Http\Resources\Student\StudentAssessmentAttemptResource;
use App\Models\Answer;
use App\Models\Assessment;
use App\Models\Question;
use App\Models\StudentAssessmentAttempt;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // ✅ ADD THIS
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttemptController extends Controller
{
    use AuthorizesRequests; // ✅ ADD THIS 
    /**
     * Show attempt page
     */
    public function attempt(Request $request, $class_id, $subject_id, $assessment_id)
    {
        try {
            $studentAssessmentAttempt = StudentAssessmentAttempt::with('studentAssessment')
                ->findOrFail($request->student_assessment_attempt_id);

            // 🔐 POLICY CHECK
            $this->authorize('attempt', $studentAssessmentAttempt);
        } catch (AuthorizationException $e) {
            return redirect()
                ->back()
                ->with('error', 'You are not allowed to access this assessment.');
        }

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
        try {
            $assessmentAttempt = StudentAssessmentAttempt::with('studentAssessment')
                ->findOrFail($request->student_assessment_attempt_id);

            // 🔐 POLICY CHECK
            $this->authorize('attempt', $assessmentAttempt);
        } catch (AuthorizationException $e) {
            return redirect()
                ->back()
                ->with('error', 'You are not allowed to submit this assessment.');
        }

        if ($assessmentAttempt->status === 'submitted') {
            return back()->with('error', 'This attempt has already been submitted.');
        }

        // Mark as submitted
        $assessmentAttempt->update([
            'completed_at' => now(),
            'status'       => 'submitted',
        ]);

        $assessmentAttempt->studentAssessment->increment('attempted_amount');
        $assessmentAttempt->studentAssessment()->update([
            'status' => 'submitted',
        ]);

        // ===============================
        // Save Answers
        // ===============================
        foreach ($request->answers as $questionId => $answer) {

            // FILE
            // if ($answer instanceof \Illuminate\Http\UploadedFile) {
            //     $answerModel = Answer::create([
            //         'student_assessment_attempt_id' => $assessmentAttempt->id,
            //         'question_id' => $questionId,
            //     ]);

            //     $path = $answer->store('answers/' . $assessmentAttempt->id, 'public');

            //     $answerModel->answerFiles()->create([
            //         'file_path' => $path,
            //     ]);

            //     continue;
            // }

            if (is_string($answer) && str_starts_with($answer, 'uploads/')) {

                $answerModel = Answer::create([
                    'student_assessment_attempt_id' => $assessmentAttempt->id,
                    'question_id' => $questionId,
                ]);

                $answerModel->answerFiles()->create([
                    'file_path' => $answer,
                ]);

                continue;
            }

            // MATCHING
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

            // SHORT ANSWER
            if (is_array($answer) && isset($answer['text'])) {
                Answer::create([
                    'student_assessment_attempt_id' => $assessmentAttempt->id,
                    'question_id' => $questionId,
                    'answer_text' => $answer['text'],
                ]);
                continue;
            }

            // MCQ / TRUE-FALSE
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
        try {
            $attempt = StudentAssessmentAttempt::with([
                'studentAssessment',
                'assessment.questions.options',
                'assessment.questions.submissionSetting',
                'assessment.questions.media',
                'answers',
            ])->findOrFail($request->student_assessment_attempt_id);

            // 🔐 POLICY CHECK
            $this->authorize('review', $attempt);
        } catch (AuthorizationException $e) {
            return redirect()
                ->back()
                ->with('error', 'You are not allowed to view this assessment.');
        }

        $assessmentAttemptResource = new StudentAssessmentAttemptResource($attempt);

        return Inertia::render(
            'student/classroom/subject/assessment/attempt/Review',
            compact('assessmentAttemptResource')
        );
    }

    public function uploadChunk(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'chunkIndex' => 'required|integer|min:0',
            'totalChunks' => 'required|integer|min:1',
            'fileName' => 'required|string',
            'questionId' => 'required',
        ]);

        $assessmentId = $request->assessment_id ?? 'general';

        $chunkIndex  = (int) $request->chunkIndex;
        $totalChunks = (int) $request->totalChunks;
        $fileName    = $request->fileName;

        $chunkDir = 'chunks/' . md5($fileName);

        // Ensure chunk directory exists
        Storage::makeDirectory($chunkDir);

        // Store chunk
        $chunkPath = "{$chunkDir}/chunk_{$chunkIndex}";
        Storage::put($chunkPath, file_get_contents($request->file));

        // If not final chunk, return early
        if ($chunkIndex + 1 < $totalChunks) {
            return response()->json(['status' => 'chunk_received']);
        }

        /* ---------- MERGE ---------- */
        $finalName = Str::uuid() . '_' . $fileName;
        $finalPath = "uploads/{$assessmentId}/answers/{$finalName}";
        Storage::makeDirectory("uploads/{$assessmentId}/answers");

        $output = fopen(Storage::path($finalPath), 'ab');

        for ($i = 0; $i < $totalChunks; $i++) {
            $path = "{$chunkDir}/chunk_{$i}";

            if (!Storage::exists($path)) {
                fclose($output);
                abort(500, "Missing chunk {$i}");
            }

            fwrite($output, Storage::get($path));
            Storage::delete($path);
        }

        fclose($output);
        Storage::deleteDirectory($chunkDir);

        /* ---------- SAVE FILE RECORD (OPTIONAL) ---------- */
        // Example: save to DB
        // $file = UploadedFile::create([
        //     'path' => $finalPath,
        //     'original_name' => $fileName,
        // ]);

        return response()->json([
            'fileId' => $finalPath, // or $file->id
        ]);
    }
}
