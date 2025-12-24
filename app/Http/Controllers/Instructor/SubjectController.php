<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $subjectId)
    {
        $subject = Subject::with('assessments')->findOrFail($subjectId);
        return Inertia::render('instructor/classroom/subject/Index', compact('subject'));
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
    public function store(Request $request, $classId)
    {
        // Validate that classId exists in the database
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'visibility'  => 'required|in:public,private',
            'cover'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Ensure the classId in the URL is valid
        if (! Classroom::where('id', $classId)->exists()) {
            abort(404, 'Classroom not found');
        }

        // Handle cover upload
        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('subjects', 'public');
        }

        // Create subject
        $subject = Subject::create([
            'name'        => $request->name,
            'description' => $request->description,
            'visibility'  => $request->visibility,
            'cover'       => $coverPath,
            'class_id'    => $classId,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Subject created successfully!');
    }



    /**
     * Display the specified resource.
     */
    public function show(Request $request, $classId, $subjectId)
    {

        // dd('show subject', $subjectId);

        $subject = Subject::with('assessments')->findOrFail($subjectId);
        // return Inertia::render('instructor/classroom/subject/Show', compact('subject'));
        return Inertia::render('instructor/classroom/subject/Index', compact('subject'));
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
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $classId, $id)
    {
        $subject = Subject::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'visibility'  => 'required|in:public,private',
            'cover'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $data = [
            'name'        => $request->name,
            'description' => $request->description,
            'visibility'  => $request->visibility,
        ];

        if ($request->hasFile('cover')) {
            // Delete old cover if it exists
            if ($subject->cover) {
                Storage::disk('public')->delete($subject->cover);
            }
            $data['cover'] = $request->file('cover')->store('subjects', 'public');
        }

        $subject->update($data);

        return redirect()->back()->with('success', 'Subject updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($classId, $id)
    {
        $subject = Subject::findOrFail($id);

        if ($subject->cover) {
            Storage::disk('public')->delete($subject->cover);
        }

        $subject->delete();

        return redirect()->back()->with('success', 'Subject deleted successfully!');
    }

    public function copy(Request $request, $class, $subject)
    {
        // 1. Validate input
        $request->validate([
            'targets' => 'required|array|min:1',
            'targets.*.class_id' => 'required|exists:classrooms,id',
        ]);

        // 2. Get source subject
        $sourceSubject = Subject::findOrFail($subject);

        DB::beginTransaction();
        $copiedCount = 0;

        try {
            foreach ($request->targets as $target) {
                $targetClassId = $target['class_id'];

                // Skip: copy into same class
                if ($targetClassId == $sourceSubject->class_id) {
                    continue;
                }

                // Skip: subject with same name already exists
                if (Subject::where('class_id', $targetClassId)
                    ->where('name', $sourceSubject->name)
                    ->exists()
                ) {
                    continue;
                }

                /*
            |--------------------------------------------------------------------------
            | 3. Clone Subject
            |--------------------------------------------------------------------------
            */
                $newSubject = $sourceSubject->replicate();
                $newSubject->class_id = $targetClassId;
                $newSubject->created_at = now();
                $newSubject->updated_at = now();

                // Clone cover image
                if ($sourceSubject->cover && Storage::disk('public')->exists($sourceSubject->cover)) {
                    $newCoverPath = 'subjects/' . uniqid() . '-' . basename($sourceSubject->cover);
                    Storage::disk('public')->copy($sourceSubject->cover, $newCoverPath);
                    $newSubject->cover = $newCoverPath;
                }

                $newSubject->save();
                $copiedCount++;

                /*
            |--------------------------------------------------------------------------
            | 4. Deep Copy: Assessments + Questions
            |--------------------------------------------------------------------------
            */
                foreach ($sourceSubject->assessments as $assessment) {

                    // Prevent duplicate assessments by title
                    $assessmentExists = $newSubject->assessments()
                        ->where('title', $assessment->title)
                        ->exists();

                    if ($assessmentExists) {
                        continue;
                    }

                    // Clone Assessment (without pivot)
                    $newAssessment = $assessment->replicate();
                    $newAssessment->created_at = now();
                    $newAssessment->updated_at = now();
                    $newAssessment->save();

                    // Attach to new subject via pivot
                    $newAssessment->subjects()->attach($newSubject->id);

                    // Clone questions
                    foreach ($assessment->questions as $question) {
                        $newQuestion = $question->replicate();
                        $newQuestion->assessment_id = $newAssessment->id;
                        $newQuestion->save();
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Copy subject failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to copy subject.');
        }

        if ($copiedCount === 0) {
            return back()->with('error', 'No subjects copied. They may already exist in target classes.');
        }

        return back()->with('success', "Subject \"{$sourceSubject->name}\" copied to {$copiedCount} class(es).");
    }
}
