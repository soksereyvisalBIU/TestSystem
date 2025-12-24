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
    public function index(Request $request)
    {
        $classrooms = auth()->user()->classes()->get();

        if ($request->wantsJson()) {
            return response()->json($classrooms);
        }

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

        // dd( $request->all());

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
        // $classroom = Classroom::with('subjects')->findOrFail($id);
        $classroom = Classroom::with('subjects')->findOrFail($id);

        $allAvailableClasses = Classroom::with('subjects')
            ->get(['id', 'name'])
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'subjects' => $class->subjects->map->only(['id', 'name'])->toArray(),
                ];
            });



        return Inertia::render('instructor/classroom/Show', compact('classroom', 'allAvailableClasses'));
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
    public function update(Request $request, $id)
    {
        // 1️⃣ Find the classroom
        $classroom = Classroom::findOrFail($id);

        // 2️⃣ Validate input
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

        // 3️⃣ Convert Major string → integer
        $majorMap = [
            "Software Engineering" => 1,
            "Computer Networking"  => 2,
            "Multimedia Design"    => 3,
        ];
        $majorValue = $majorMap[$validated['major']] ?? null;

        // 4️⃣ Convert Shift string → integer
        $shiftMap = [
            "Morning"   => 1,
            "Afternoon" => 2,
            "Evening"   => 3,
            "Weekend"   => 4,
        ];
        $shiftValue = $shiftMap[$validated['shift']] ?? null;

        // 5️⃣ Upload Cover Image (optional)
        if ($request->hasFile('cover')) {
            // Delete old cover if exists
            if ($classroom->cover) {
                \Storage::disk('public')->delete($classroom->cover);
            }
            $coverPath = $request->file('cover')->store('classrooms', 'public');
            $classroom->cover = $coverPath;
        }

        // 6️⃣ Update classroom
        $classroom->update([
            'name'        => $validated['name'],
            'description' => $validated['description'],
            'campus'      => (int) $validated['campus'],
            'major'       => $majorValue,
            'batch'       => (int) $validated['batch'],
            'year'        => (int) $validated['year'],
            'semester'    => (int) $validated['semester'],
            'shift'       => $shiftValue,
            // 'cover' is already updated above if uploaded
        ]);

        return back()->with('success', 'Class updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
