<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentAssessment;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $classId)
    {
        $subject = Subject::with('assessments')->findOrFail($classId);
        return Inertia::render('student/classroom/subject/Index', compact('subject'));
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
    // public function show($classId)
    // {
    //     $subject = Subject::with('assessments')->findOrFail($classId);
    //     dd(response()->json($subject));
    //     // {"id":1,"name":"C++ Programming Language I","description":null,"class_id":1,"visibility":"public","cover":"subjects\/FaauG1rTv9PrRBLstMtnbGp9nBFeaz8hH7i20f3V.jpg","created_at":"2025-12-12T10:54:46.000000Z","updated_at":"2025-12-12T10:54:46.000000Z","assessments":[{"id":1,"title":"Week I Test","description":"Good luck everyone","type":"quiz","start_time":"2025-12-11 17:55:00","end_time":"2025-12-13 17:55:00","duration":60,"max_attempts":1,"created_by":null,"created_at":"2025-12-12T10:55:28.000000Z","updated_at":"2025-12-12T10:55:28.000000Z","pivot":{"subject_id":1,"assessment_id":1}}]}
    //     $studentAssessment = Auth::user()->studentAssessment;

    //     // $studentAssessment = StudentAssessment::
    //     dd(response()->json($studentAssessment));
    //     // [{"id":1,"user_id":4,"assessment_id":1,"status":"scored","score":59,"attempted_amount":1,"created_at":"2025-12-12T11:02:53.000000Z","updated_at":"2025-12-12T11:09:23.000000Z"}]

    //     return Inertia::render('student/classroom/subject/Index', compact('subject' , 'studentAssessment'));
    // }
    public function show($classId, Request $request)
    {
        // 1. Fetch the Subject and all its associated Assessments
        $subject = Subject::with('assessments')->findOrFail($classId);

        // 2. Fetch the Student's specific assessments for this subject's assessments
        // This is more performant than fetching ALL student assessments globally.
        $assessmentIds = $subject->assessments->pluck('id');

        $studentAssessments = Auth::user()->studentAssessment()
            ->whereIn('assessment_id', $assessmentIds)
            ->get();

        // 3. Merge Student Assessment data into the Subject Assessments
        $subject->assessments = $subject->assessments->map(function ($assessment) use ($studentAssessments) {

            // Find the specific StudentAssessment record for this assessment
            $studentRecord = $studentAssessments->firstWhere('assessment_id', $assessment->id);

            // Append the student's status and score directly to the assessment object
            $assessment->student_status = $studentRecord ? $studentRecord->status : 'not_attempted';
            $assessment->student_score = $studentRecord ? $studentRecord->score : null;

            // Add the necessary class_id for route generation in the frontend
            // $assessment->class_id = $subject->class_id;

            return $assessment;
        });

        // dd($subject);

        // We no longer need to pass $studentAssessment separately.
        return Inertia::render('student/classroom/subject/Index', [
            'subject' => $subject,
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
}
