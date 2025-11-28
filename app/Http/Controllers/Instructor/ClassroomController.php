<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classrooms = auth()->user()->classes()->get();


        return Inertia::render('instructor/classroom/Index', compact('classrooms'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1️⃣ Validate input
        $validated = $request->validate([
            'name'        => "required|string|max:255",
            'description' => "nullable|string|max:255",
            'campus'      => "required|integer",
            'major'       => "required|string|max:255",
            'batch'       => "required|integer",
            'year'        => "required|integer",
            'semester'    => "required|integer",
            'shift'       => "required|string|max:255",
            'cover'       => "nullable|image|max:2048",
        ]);

        // 2️⃣ Convert Major string → integer (your tinyInteger requirement)
        $majorMap = [
            "Software Engineering" => 1,
            "Computer Networking"  => 2,
            "Multimedia Design"    => 3,
        ];

        $majorValue = $majorMap[$validated['major']] ?? null;

        // 3️⃣ Convert Shift string → integer
        $shiftMap = [
            "Morning"   => 1,
            "Afternoon" => 2,
            "Evening"   => 3,
            "Weekend"   => 4,
        ];

        $shiftValue = $shiftMap[$validated['shift']] ?? null;

        // 4️⃣ Upload Cover Image (optional)
        $coverPath = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('classrooms', 'public');
        }

        // 5️⃣ Save to DB
        $classroom = Classroom::create([
            'name'        => $validated['name'],
            'description' => $validated['description'],
            'campus'      => (int) $validated['campus'],
            'major'       => $majorValue,
            'batch'       => (int) $validated['batch'],
            'year'        => (int) $validated['year'],
            'semester'    => (int) $validated['semester'],
            'shift'       => $shiftValue,
            'cover'       => $coverPath,
            'creator_id'  => auth()->id(),
        ]);

        return back()->with('success', 'Class created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('instructor/classroom/Show');
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
