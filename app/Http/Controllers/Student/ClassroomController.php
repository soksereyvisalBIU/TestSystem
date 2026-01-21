<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

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

    //     public function index(Request $request)
    // {
    //     $student = auth()->user();

    //     $classrooms = Classroom::query()
    //         ->whereIn('visibility', ['public', 'protected'])
    //         ->when($request->filled('year'), function ($q) use ($request) {
    //             $q->where('year', $request->year);
    //         })
    //         ->withCount([
    //             // adds joined = 1 if student joined, 0 if not
    //             'students as joined' => function ($q) use ($student) {
    //                 $q->where('student_id', $student->id);
    //             }
    //         ])
    //         ->paginate(10)
    //         ->withQueryString();

    //     return Inertia::render('student/classroom/Index', [
    //         'classrooms' => $classrooms
    //     ]);
    // }

    public function index(Request $request)
    {
        $request->validate([
            'year' => ['nullable', 'integer', 'between:1,5'],
        ]);

        $studentId = auth()->id();

        // $classrooms = Classroom::query()
        //     // Include public/protected or private classrooms the student joined
        //     ->whereIn('visibility', ['public', 'protected'])
        //     ->orWhereHas('students', function ($q) use ($studentId) {
        //         $q->where('student_classroom.user_id', $studentId);
        //     })
        //     // Optional year filter
        //     ->when($request->filled('year'), fn($q) => $q->where('year', (int) $request->year))
        //     // Count if student has joined
        //     ->withCount([
        //         'students as joined' => fn($q) => $q->where('student_classroom.user_id', $studentId)
        //     ])
        //     ->paginate(10)
        //     ->withQueryString();

        $classrooms = Classroom::query()
            ->where(function ($q) use ($studentId) {
                $q->whereIn('visibility', ['public', 'protected'])
                    ->orWhereHas('students', function ($q) use ($studentId) {
                        $q->where('student_classroom.user_id', $studentId);
                    });
            })
            ->when($request->filled('year'), function ($q) use ($request) {
                $q->where('year', (int) $request->year);
            })
            ->withCount([
                'students as joined' => fn($q) =>
                $q->where('student_classroom.user_id', $studentId)
            ])
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('student/classroom/Index', [
            'classrooms' => $classrooms
        ]);
    }


    // public function index(Request $request)
    // {
    //     $request->validate([
    //         'year' => ['nullable', 'integer', 'between:1,5'],
    //     ]);

    //     $student = auth()->user();

    //     $classrooms = Classroom::query()
    //         ->where(function ($q) use ($student) {

    //             $q->whereIn('visibility', ['public', 'protected'])

    //                 ->orWhere(function ($q) use ($student) {
    //                     $q->where('visibility', 'private')
    //                         ->whereHas('students', function ($q) use ($student) {
    //                             $q->where('student_classroom.user_id', $student->id);
    //                         });
    //                 });
    //         })
    //         ->when(
    //             $request->filled('year'),
    //             fn($q) => $q->where('year', (int) $request->year)
    //         )
    //         ->withCount([
    //             'students as joined' => function ($q) use ($student) {
    //                 $q->where('student_classroom.user_id', $student->id);
    //             }
    //         ])
    //         ->paginate(10)
    //         ->withQueryString();

    //     // return response()->json($classrooms);

    //     return Inertia::render('student/classroom/Index', [
    //         'classrooms' => $classrooms
    //     ]);
    // }






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
    // public function show(string $id)
    // {
    //     $classroom = Classroom::with('subjects')->findOrFail($id);
    //     return Inertia::render('student/classroom/Show', compact('classroom'));
    // }
    public function show(string $id)
    {
        $classroom = Classroom::findOrFail($id);

        // Private classroom protection
        if ($classroom->visibility === 'private') {
            $isMember = auth()->user()
                ->classrooms()
                ->where('classroom_id', $id)
                ->exists();

            if (!$isMember) {
                abort(403, 'This classroom is private.');
            }
        }

        $classroom->load(['subjects']);

        // Check if user joined
        $isJoined = $classroom->students()
            ->where('user_id', auth()->id())
            ->exists();

        // dd($isJoin);

        return Inertia::render('student/classroom/Show', [
            'classroom' => $classroom,
            'isJoined' => $isJoined,
        ]);
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

    public function join(Request $request)
    {
        // dd($request->code);
        $request->validate([
            'code' => 'required|string|size:8',
        ]);


        $classroom = Classroom::where('code', strtoupper($request->code))->first();

        // 1. Check if class exists
        if (!$classroom) {
            return back()->withErrors(['code' => 'The provided class code is invalid.']);
        }

        // 2. Check if user is already in the class
        if ($classroom->students()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['code' => 'You are already a member of this class.']);
        }

        // 3. Attach student
        $classroom->students()->attach(Auth::id());

        return back()->with('success', "Welcome to {$classroom->name}!");
    }

    // public function join(string $code){

    //     if(Str::length($code) != 8)
    //         return;

    //     $classroom = Classroom::where('code' , $code)->get();

    //     if($classroom){
    //         Auth::user()->classrooms()->attach($classroom->id);
    //         return back();
    //     }
    // }
}
