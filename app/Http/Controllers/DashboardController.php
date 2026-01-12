<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // $this->middleware(function ($request, $next) {

        $user = auth()->user();

        // if (Gate::allows('access-admin-page')) {
        //     return redirect()->route('admin.dashboard');
        // }

        // if (Gate::allows('access-instructor-page')) {
        //     return redirect()->route('instructor.dashboard');
        // }

        // return redirect()->route('student.dashboard');


        if (Gate::allows('access-admin-page')) {
            return Inertia::render('admin-dashboard');
        }

        if (Gate::allows('access-instructor-page')) {
            return Inertia::render('instructor-dashboard');
        }


        $studentData = \App\Models\User::with(
            'studentClassrooms.subjects.assessments',
            'studentAssessment.attempts',
            // 'studentAssessmentAttempt'

        )->find(Auth::id());

        // return response()->json($studentData);  
        // {
        // "id": 7,
        // "name": "Elaine Ratliff",
        // "email": "bigehe@mailinator.com",
        // "email_verified_at": null,
        // "two_factor_confirmed_at": null,
        // "role": 1,
        // "created_at": "2026-01-12T07:36:47.000000Z",
        // "updated_at": "2026-01-12T07:36:47.000000Z",
        // "student_classrooms": [
        // {
        // "id": 1,
        // "name": "Et voluptas adipisci",
        // "description": "Adipisci aut volupta",
        // "visibility": "private",
        // "code": "8IFKCJCP",
        // "cover": "classrooms/UofxE3PB0wK0IVBLmV2WuMyxIMqHsRq2gG7NjP2P.jpg",
        // "creator_id": 2,
        // "campus": 1,
        // "faculty": null,
        // "major": 3,
        // "batch": 100,
        // "year": 3,
        // "semester": 2,
        // "shift": 4,
        // "room": null,
        // "created_at": "2026-01-10T02:33:51.000000Z",
        // "updated_at": "2026-01-10T02:33:51.000000Z",
        // "pivot": {
        // "user_id": 7,
        // "classroom_id": 1
        // },
        // "subjects": [
        // {
        // "id": 2,
        // "name": "Irure possimus omni",
        // "description": "Soluta quos voluptat",
        // "class_id": 1,
        // "visibility": "private",
        // "cover": "subjects/aStd7PpRVNfiDopQP2hfDKHSJ2MrIf3j4CSBninO.jpg",
        // "created_at": "2026-01-12T07:55:44.000000Z",
        // "updated_at": "2026-01-12T07:55:44.000000Z",
        // "assessments": [
        // {
        // "id": 2,
        // "title": "Velit enim eos volu",
        // "description": "Nisi eos pariatur U",
        // "type": "quiz",
        // "start_time": "1984-07-04 00:19:00",
        // "end_time": "2026-01-13 04:59:00",
        // "duration": 61,
        // "max_attempts": 77,
        // "created_by": null,
        // "created_at": "2026-01-12T07:55:53.000000Z",
        // "updated_at": "2026-01-12T07:56:04.000000Z",
        // "pivot": {
        // "subject_id": 2,
        // "assessment_id": 2
        // }
        // }
        // ]
        // }
        // ]
        // }
        // ],
        // "student_assessment": [
        // {
        // "id": 1,
        // "user_id": 7,
        // "assessment_id": 2,
        // "status": "scored",
        // "score": "61.00",
        // "attempted_amount": 1,
        // "created_at": "2026-01-12T07:57:02.000000Z",
        // "updated_at": "2026-01-12T08:22:28.000000Z",
        // "attempts": [
        // {
        // "id": 1,
        // "uuid": null,
        // "student_assessment_id": 1,
        // "status": "scored",
        // "started_at": "2026-01-12T07:57:04.000000Z",
        // "completed_at": "2026-01-12 14:57:23",
        // "sub_score": "61.00",
        // "created_at": "2026-01-12T07:57:02.000000Z",
        // "updated_at": "2026-01-12T08:22:28.000000Z"
        // }
        // ]
        // },
        // {
        // "id": 2,
        // "user_id": 7,
        // "assessment_id": 1,
        // "status": "submitted",
        // "score": "0.00",
        // "attempted_amount": 2,
        // "created_at": "2026-01-12T08:17:51.000000Z",
        // "updated_at": "2026-01-12T08:24:22.000000Z",
        // "attempts": [
        // {
        // "id": 2,
        // "uuid": null,
        // "student_assessment_id": 2,
        // "status": "submitted",
        // "started_at": "2026-01-12T08:17:52.000000Z",
        // "completed_at": "2026-01-12 15:17:55",
        // "sub_score": "0.00",
        // "created_at": "2026-01-12T08:17:51.000000Z",
        // "updated_at": "2026-01-12T08:17:55.000000Z"
        // },
        // {
        // "id": 3,
        // "uuid": null,
        // "student_assessment_id": 2,
        // "status": "submitted",
        // "started_at": "2026-01-12T08:24:20.000000Z",
        // "completed_at": "2026-01-12 15:24:22",
        // "sub_score": "0.00",
        // "created_at": "2026-01-12T08:24:20.000000Z",
        // "updated_at": "2026-01-12T08:24:22.000000Z"
        // },
        // {
        // "id": 4,
        // "uuid": null,
        // "student_assessment_id": 2,
        // "status": "draft",
        // "started_at": "2026-01-12T08:24:24.000000Z",
        // "completed_at": null,
        // "sub_score": "0.00",
        // "created_at": "2026-01-12T08:24:24.000000Z",
        // "updated_at": "2026-01-12T08:24:24.000000Z"
        // }
        // ]
        // }
        // ]
        // }
        return Inertia::render('student-dashboard', [
            'student' => $studentData,
        ]);
    }
}
