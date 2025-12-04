<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Instructor\AssessmentResource;
use App\Models\Assessment;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($classId, $subjectId)
    {
        $subject = Subject::with([
            'assessments' => function ($query) {
                $query->withCount('questions');   // count questions per assessment
            }
        ])->findOrFail($subjectId);

        return Inertia::render('instructor/classroom/subject/assessment/Index', compact('subject'));
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
            'deadline' => 'nullable|date|after_or_equal:start_time',
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
            'end_time' => $validated['deadline'] ?? null,
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
}
