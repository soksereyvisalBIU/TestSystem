<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $class_id      = $request->route('class');
        $subject_id    = $request->route('subject');
        $assessment_id = $request->route('assessment');

        // Debug if needed
        // dd(compact('class', 'subject', 'assessment'));

        return Inertia::render(
            'instructor/classroom/subject/assessment/question/Index',
            compact('class_id', 'subject_id', 'assessment_id')
        );
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('instructor/classroom/subject/assessment/question/Create');
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
    public function show(string $id)
    {
        //
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
