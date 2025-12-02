<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
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
    public function show(Request $request, $classId , $subjectId)
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
