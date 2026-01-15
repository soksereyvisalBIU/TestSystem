<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $classId)
    {
        // $subject = Subject::with('assessments')->findOrFail($classId);

        // dd($subject);

        // return Inertia::render('student/classroom/subject/Index', compact('subject'));
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($class_id, $subject_id)
    {
        $subject = Subject::with('assessments.studentAssessment')->findOrFail($subject_id);

        $classmates = $subject->classroom->students;

        // return response()->json($subject);
        return Inertia::render('student/classroom/subject/Index', compact('subject',  'classmates'));
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
