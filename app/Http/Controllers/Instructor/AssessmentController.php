<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Instructor\AssessmentResource;
use App\Models\Assessment;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Load assessment and questions
        $source = Assessment::with('questions')->findOrFail($assessment);

        foreach ($request->targets as $target) {
            foreach ($target['subject_ids'] as $subjectId) {

                // 1. Prevent duplicate assessment inside same subject
                $alreadyExists = Subject::find($subjectId)
                    ->assessments()
                    ->where('title', $source->title)
                    ->exists();

                if ($alreadyExists) {
                    // Skip this subject because a copy exists
                    continue;
                }

                // 2. Clone the assessment
                $newAssessment = $source->replicate();
                $newAssessment->created_at = now();
                $newAssessment->updated_at = now();
                $newAssessment->save();

                // 3. Clone the questions
                foreach ($source->questions as $q) {
                    $newQuestion = $q->replicate();
                    $newQuestion->assessment_id = $newAssessment->id;
                    $newQuestion->save();
                }

                // 4. Attach to subject
                $newAssessment->subjects()->attach($subjectId);
            }
        }
        // Use a database transaction to ensure atomicity (all copies succeed or all fail)
        // DB::transaction(function () use ($sourceAssessment, $targets) {

        //     // Loop through each Class target
        //     foreach ($targets as $target) {
        //         $classId = $target['class_id'];
        //         $subjectIds = $target['subject_ids'];

        //         // Loop through each Subject within the Class target
        //         foreach ($subjectIds as $subjectId) {

        //             // 2. Duplicate the Assessment (Shallow Copy)
        //             $newAssessment = $sourceAssessment->replicate();

        //             // Modify necessary attributes for the copy (optional, e.g., prepending "Copy of")
        //             $newAssessment->title = "Copy of {$sourceAssessment->title}";
        //             $newAssessment->save();

        //             // 3. Attach the New Assessment to the Target Subject
        //             // Assuming Assessment has a many-to-many relationship with Subject
        //             // We don't need the class ID here, only the subject ID (as subjects are attached to classes)
        //             $subject = Subject::findOrFail($subjectId);
        //             $subject->assessments()->attach($newAssessment->id);

        //             // 4. Duplicate and Attach Questions (Deep Copy)
        //             if ($sourceAssessment->questions->isNotEmpty()) {
        //                 // Collect all new question instances
        //                 $newQuestions = $sourceAssessment->questions->map(function ($question) {
        //                     return $question->replicate();
        //                 });

        //                 // Save all new questions simultaneously
        //                 // Assumes a one-to-many relationship: Assessment hasMany Questions
        //                 $newAssessment->questions()->saveMany($newQuestions);

        //                 // You may need to handle copying related models (e.g., question answers/options) here
        //                 // If Question has many Options:
        //                 /*
        //             foreach ($sourceAssessment->questions as $index => $sourceQuestion) {
        //                 $newQuestion = $newQuestions[$index]; // Match the new question to its source
        //                 $newOptions = $sourceQuestion->options->map(fn ($option) => $option->replicate());
        //                 $newQuestion->options()->saveMany($newOptions);
        //             }
        //             */
        //             }
        //         }
        //     }
        // });

        // 5. Successful Response
        return redirect()->back()->with(
            'success',
            'Assessment copied successfully to class(es) and its selected subjects.'
            // 'Assessment copied successfully to ' . count($targets) . ' class(es) and its selected subjects.'
        );
    }
}
