<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index(Request $request)
    // {
    //     if ($request->has('year')) {
    //         $year = $request->input('year');
    //         $classrooms = Classroom::where('year', $year)->paginate(10);
    //         return Inertia::render('student/classroom/Index', compact('classrooms'));
    //     }
    //     // $classrooms = auth()->user()->studentClassrooms()->with('instructor')->get();
    //     $classrooms = Classroom::where('visibility', 'public')->paginate(10); // Placeholder for actual data retrieval
    //     return Inertia::render('student/classroom/Index', compact('classrooms'));
    // }

    public function index(Request $request)
    {
        $query = Classroom::query()
            ->where('visibility', 'public');

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        $classrooms = $query->paginate(10)->withQueryString();

        return Inertia::render('student/classroom/Index', [
            'classrooms' => $classrooms,
        ]);
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
    public function show(string $id)
    {
        $classroom = Classroom::with('subjects')->findOrFail($id);
        return Inertia::render('student/classroom/Show', compact('classroom'));
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
