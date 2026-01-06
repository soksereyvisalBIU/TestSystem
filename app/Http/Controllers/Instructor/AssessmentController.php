<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Instructor\AssessmentResource;
use App\Models\Assessment;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($classId, $subjectId)
    {
        $availableClasses = Classroom::with('subjects')
            ->get(['id', 'name'])
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'subjects' => $class->subjects->map->only(['id', 'name'])->toArray(),
                ];
            });

        $subject = Subject::with([
            'assessments' => function ($query) {
                $query->withCount('questions')
                    ->orderByDesc('created_at'); // latest first
            }
        ])->findOrFail($subjectId);

        return Inertia::render(
            'instructor/classroom/subject/assessment/Index',
            compact('subject', 'availableClasses')
        );
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
    public function store(Request $request, $classId, $subjectId)
    {
        // Validate input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', Rule::in(['quiz', 'exam', 'homework', 'midterm', 'final'])],
            'max_attempts' => 'nullable|integer|min:1',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration' => 'required'
        ]);

        // Find the subject
        $subject = Subject::findOrFail($subjectId);

        // Create assessment
        $assessment = Assessment::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'duration' => $validated['duration'],
            'max_attempts' => $validated['max_attempts'] ?? null,
            'start_time' => $validated['start_time'] ?? null,
            'end_time' => $validated['end_time'] ?? null,
        ]);

        // Attach to pivot
        $subject->assessments()->attach($assessment->id);

        return redirect()->back()->with('success', 'Assessment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($classId, $subjectId, $assessment_id)
    {
        // $assessment = Assessment::with('questions')->findOrFail($assessment_id);

        $assessment = (new AssessmentResource(
            Assessment::with('questions', 'students')->findOrFail($assessment_id)
        ))->resolve();

        return Inertia::render('instructor/classroom/subject/assessment/Show', compact('assessment', 'classId', 'subjectId'));
    }

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
    public function update(Request $request, $classId, $subjectId, $assessmentId)
    {
        // Validate input (same rules as store)
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'type'         => ['required', Rule::in(['quiz', 'exam', 'homework', 'midterm', 'final'])],
            'max_attempts' => 'nullable|integer|min:1',
            'start_time'   => 'nullable|date',
            'end_time'     => 'nullable|date|after_or_equal:start_time',
            'duration'     => 'required',
        ]);

        // Find subject (ensure it exists)
        $subject = Subject::findOrFail($subjectId);

        // Find assessment
        $assessment = Assessment::findOrFail($assessmentId);

        // Update assessment
        $assessment->update([
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'type'         => $validated['type'],
            'duration'     => $validated['duration'],
            'max_attempts' => $validated['max_attempts'] ?? null,
            'start_time'   => $validated['start_time'] ?? null,
            'end_time'     => $validated['end_time'] ?? null,
        ]);

        // Ensure assessment is attached to the subject (safe-guard)
        if (! $subject->assessments()->where('assessment_id', $assessment->id)->exists()) {
            $subject->assessments()->attach($assessment->id);
        }

        return redirect()->back()->with('success', 'Assessment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function copy(Request $request, $assessment)
    {
        $request->validate([
            'targets' => ['required', 'array', 'min:1'],
            'targets.*.class_id' => ['required', 'integer', 'exists:classrooms,id'],
            'targets.*.subject_ids' => ['required', 'array', 'min:1'],
            'targets.*.subject_ids.*' => ['required', 'integer', 'exists:subjects,id'],
        ]);

        // 1. Eager load all relations to prevent N+1 issues
        $source = Assessment::with([
            'questions.options',
            'questions.media',
            'questions.submissionSetting'
        ])->findOrFail($assessment);

        DB::beginTransaction();
        try {
            foreach ($request->targets as $target) {
                foreach ($target['subject_ids'] as $subjectId) {

                    // Prevent duplicate assessment inside same subject
                    $alreadyExists = Subject::find($subjectId)
                        ->assessments()
                        ->where('title', $source->title)
                        ->exists();

                    if ($alreadyExists) continue;

                    // 2. Clone the assessment
                    $newAssessment = $source->replicate();
                    $newAssessment->created_at = now();
                    $newAssessment->updated_at = now();
                    $newAssessment->save();

                    // 3. Deep Clone the questions and their relations
                    foreach ($source->questions as $q) {
                        $newQuestion = $q->replicate();
                        $newQuestion->assessment_id = $newAssessment->id;
                        $newQuestion->save();

                        // Clone Options
                        foreach ($q->options as $option) {
                            $newOption = $option->replicate();
                            $newOption->question_id = $newQuestion->id;
                            $newOption->save();
                        }

                        // Clone Media (including physical file copy if necessary)
                        foreach ($q->media as $mediaItem) {
                            $newMedia = $mediaItem->replicate();
                            $newMedia->question_id = $newQuestion->id;

                            // Optional: Copy file if your media has a path
                            if (isset($mediaItem->file_path) && Storage::disk('public')->exists($mediaItem->file_path)) {
                                $newPath = 'questions/media/' . uniqid() . '-' . basename($mediaItem->file_path);
                                Storage::disk('public')->copy($mediaItem->file_path, $newPath);
                                $newMedia->file_path = $newPath;
                            }
                            $newMedia->save();
                        }

                        // Clone Submission Setting
                        if ($q->submissionSetting) {
                            $newSetting = $q->submissionSetting->replicate();
                            $newSetting->question_id = $newQuestion->id;
                            $newSetting->save();
                        }
                    }

                    // 4. Attach to subject
                    $newAssessment->subjects()->attach($subjectId);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Deep copy failed: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to copy assessment and its details.');
        }

        return redirect()->back()->with('success', 'Assessment and all questions copied successfully.');
    }


    // public function copy(Request $request, $assessment)
    // {
    //     $request->validate([
    //         'targets' => ['required', 'array', 'min:1'],
    //         'targets.*.class_id' => ['required', 'integer', 'exists:classrooms,id'],
    //         'targets.*.subject_ids' => ['required', 'array', 'min:1'],
    //         'targets.*.subject_ids.*' => ['required', 'integer', 'exists:subjects,id'],
    //     ]);

    //     // Load assessment and questions
    //     $source = Assessment::with('questions')->findOrFail($assessment);

    //     foreach ($request->targets as $target) {
    //         foreach ($target['subject_ids'] as $subjectId) {

    //             // 1. Prevent duplicate assessment inside same subject
    //             $alreadyExists = Subject::find($subjectId)
    //                 ->assessments()
    //                 ->where('title', $source->title)
    //                 ->exists();

    //             if ($alreadyExists) {
    //                 // Skip this subject because a copy exists
    //                 continue;
    //             }

    //             // 2. Clone the assessment
    //             $newAssessment = $source->replicate();
    //             $newAssessment->created_at = now();
    //             $newAssessment->updated_at = now();
    //             $newAssessment->save();

    //             // 3. Clone the questions
    //             foreach ($source->questions as $q) {
    //                 $newQuestion = $q->replicate();
    //                 $newQuestion->assessment_id = $newAssessment->id;
    //                 $newQuestion->save();
    //             }

    //             // 4. Attach to subject
    //             $newAssessment->subjects()->attach($subjectId);
    //         }
    //     }
    //     // 5. Successful Response
    //     return redirect()->back()->with(
    //         'success',
    //         'Assessment copied successfully to class(es) and its selected subjects.'
    //         // 'Assessment copied successfully to ' . count($targets) . ' class(es) and its selected subjects.'
    //     );
    // }
}
