<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function Laravel\Prompts\confirm;

class AssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request , $id)
    {

    }

    public function request(Request $request, $class_id, $subject_id, $assessment_id)
    {
        // TODO: validation, check eligibility, etc.
        // Redirect back to index route with success message
        return redirect()
            // ->route('student.classes.subjects.assessments.index', [
            ->route('student.classes.subjects.assessments.attempt', [
                'class_id' => $class_id,
                'subject_id' => $subject_id,
                'assessment_id' => $assessment_id,
            ])
            ->with('success', 'Assessment attempt requested successfully!');
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
    public function show($class_id, $subject_id, $id)
    {
        $assessment = Assessment::findOrFail($id);
        return Inertia::render('student/classroom/subject/assessment/attempt/Confirm', compact('assessment', 'class_id', 'subject_id'));
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
