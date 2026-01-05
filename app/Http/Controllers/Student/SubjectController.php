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
        // dd($subject);

        // return response()->json($subject);
        // {
        // "id": 1,
        // "name": "Recusandae Labore c",
        // "description": "Ut est id dolores s",
        // "class_id": 1,
        // "visibility": "private",
        // "cover": "subjects/GyG64W3cPfmuMsWCO9YcQQLsb7WlUotutxgcSiOO.png",
        // "created_at": "2025-12-26T10:23:33.000000Z",
        // "updated_at": "2025-12-27T05:02:13.000000Z",
        // "assessments": [
        // {
        // "id": 1,
        // "title": "Tempora soluta assum",
        // "description": "Impedit harum exerc",
        // "type": "quiz",
        // "start_time": "2025-12-25 15:00:00",
        // "end_time": "2025-12-27 05:00:00",
        // "duration": 90,
        // "max_attempts": 5,
        // "created_by": null,
        // "created_at": "2025-12-26T10:23:59.000000Z",
        // "updated_at": "2025-12-26T10:23:59.000000Z",
        // "pivot": {
        // "subject_id": 1,
        // "assessment_id": 1
        // },
        // "student_assessment": {
        // "id": 1,
        // "user_id": 2,
        // "assessment_id": 1,
        // "status": "scored",
        // "score": "78.55",
        // "attempted_amount": 2,
        // "created_at": "2025-12-26T10:26:36.000000Z",
        // "updated_at": "2025-12-26T10:45:52.000000Z"
        // }
        // }
        // ]
        // }
        return Inertia::render('student/classroom/subject/Index', compact('subject'));
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
