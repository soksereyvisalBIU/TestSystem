<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

use function Pest\Laravel\json;

class DashboardController extends Controller
{
    /**
     * Optimized Dashboard Index
     * Focus: Reduced query depth, eager loading constraints, and early exits.
     */
    public function index()
    {
        $user = Auth::user();

        // 1. Prioritize Early Exits for Admin/Instructor
        if (Gate::allows('access-admin-page')) {
            return Inertia::render('admin-dashboard');
        }

        if (Gate::allows('access-instructor-page')) {

            // $user->load('createdClassrooms'); // Only count classes, no need for full relation

            // base on the respone json below, the result of it is in the json below it
            // return response()->json($user->createdClassrooms()->with('subjects.assessments.studentAssessmentAttempts' , 'students')->get());


            // $classrooms = $user->createdClassrooms()
            //     ->select([
            //         'id',
            //         'name',
            //         'code',
            //         'creator_id',
            //         'created_at',
            //     ])
            //     ->with([
            //         // Students enrolled in classroom
            //         'students:id,name,email',

            //         // Subjects
            //         'subjects:id,name,class_id',

            //         // Assessments under subjects
            //         'subjects.assessments:id,title,type,start_time,end_time',

            //         // Student attempts for each assessment
            //         'subjects.assessments.studentAssessmentAttempts' => function ($q) {
            //             $q->select([
            //                 'id',
            //                 'user_id',
            //                 'assessment_id',
            //                 'status',
            //                 'score',
            //                 'attempted_amount',
            //             ])
            //                 ->with([
            //                     // Student info
            //                     'student:id,name,email',

            //                     // Last attempt only (important for dashboard)
            //                     'lastAttempt:id,student_assessment_id,completed_at,status',
            //                 ]);
            //         },
            //     ])
            //     ->orderBy('created_at', 'desc')
            //     ->get();


            $classrooms = $user->createdClassrooms()
                ->select('id', 'name', 'code') // Only basic classroom info
                ->with([
                    'students' => function ($query) {
                        $query->select('users.id', 'name', 'email', 'avatar');
                    },
                    'subjects' => function ($query) {
                        $query->select('id', 'class_id', 'name');
                    },
                    'subjects.assessments' => function ($query) {
                        $query->select('assessments.id', 'title', 'type');
                    },
                    'subjects.assessments.studentAssessmentAttempts' => function ($query) {
                        // Filter down to the bare essentials for the dashboard logic
                        $query->select('id', 'user_id', 'assessment_id', 'status', 'score', 'updated_at')
                            ->with([
                                'student:id,name,email,avatar',
                                'lastAttempt:id,student_assessment_id,completed_at,status'
                            ]);
                    }
                ])
                ->get();
            return Inertia::render('instructor-dashboard', [
                'classrooms' => $classrooms,
            ]);

            // $user->load('createdClassrooms.subjects');

            // dd($user->createdClassrooms);
        }

        // 2. High-Performance Eager Loading
        // Optimization: Use select() to avoid fetching unnecessary columns (like passwords/tokens)
        // and only fetch specific relations needed for the dashboard view.
        $studentData = User::where('id', $user->id)
            ->select(['id', 'name', 'email', 'avatar'])
            ->with([
                'studentClassrooms' => function ($query) {
                    $query->select('classrooms.id', 'classrooms.name', 'classrooms.year', 'classrooms.batch');
                },
                'studentClassrooms.subjects' => function ($query) {
                    // class_id is the foreign key connecting to studentClassrooms
                    $query->select('subjects.id', 'subjects.name', 'subjects.class_id');
                },
                'studentClassrooms.subjects.assessments' => function ($query) {
                    $query->select('assessments.id', 'assessments.title', 'assessments.type', 'assessments.end_time');
                },
                'studentAssessment.attempts' => function ($query) {
                    // Fix: Changed assessment_id to student_assessment_id based on your SQL error
                    $query->select('id', 'student_assessment_id', 'sub_score', 'created_at')
                        ->latest()
                        ->limit(5);
                }
            ])
            ->first();
        // $studentData = User::with(
        //     'studentClassrooms.subjects.assessments',
        //     'studentAssessment.attempts',
        // )->find(Auth::id());
        // return response()->json($studentData);

        return Inertia::render('student-dashboard', [
            'student' => $studentData,
        ]);
    }
}


// {
//   "id": 7,
//   "name": "Oren Ortega",
//   "email": "jedefeqyc@mailinator.com",
//   "email_verified_at": null,
//   "two_factor_confirmed_at": null,
//   "google_id": null,
//   "avatar": null,
//   "role": 1,
//   "password_changed_at": null,
//   "created_at": "2026-01-24T01:50:49.000000Z",
//   "updated_at": "2026-01-24T01:50:49.000000Z",
//   "student_classrooms": [
//     {
//       "id": 1,
//       "name": "UC1-Y1S1-SE-M1",
//       "description": null,
//       "visibility": "public",
//       "code": "1EAMTA4H",
//       "cover": null,
//       "creator_id": 2,
//       "campus": 1,
//       "faculty": null,
//       "major": 1,
//       "batch": 8,
//       "year": 1,
//       "semester": 1,
//       "shift": 1,
//       "room": null,
//       "created_at": "2026-01-23T10:04:52.000000Z",
//       "updated_at": "2026-01-23T10:04:52.000000Z",
//       "pivot": {
//         "user_id": 7,
//         "classroom_id": 1
//       },
//       "subjects": [
//         {
//           "id": 1,
//           "name": "C++ programming",
//           "description": null,
//           "class_id": 1,
//           "visibility": "public",
//           "cover": "subjects/68lONiOwv3wELqym2Z7qa7yB8VoTISOrL0s2pTp1.png",
//           "created_at": "2026-01-23T10:05:43.000000Z",
//           "updated_at": "2026-01-23T10:05:43.000000Z",
//           "assessments": [
//             {
//               "id": 1,
//               "title": "Quizz 1",
//               "description": null,
//               "type": "quiz",
//               "start_time": "2026-01-23 17:06:00",
//               "end_time": "2026-02-06 17:06:00",
//               "duration": 60,
//               "max_attempts": 3,
//               "created_by": null,
//               "created_at": "2026-01-23T10:06:21.000000Z",
//               "updated_at": "2026-01-23T10:06:21.000000Z",
//               "pivot": {
//                 "subject_id": 1,
//                 "assessment_id": 1
//               }
//             }
//           ]
//         },
//         {
//           "id": 2,
//           "name": "Deleniti enim conseq",
//           "description": "Quo et nemo mollit d",
//           "class_id": 1,
//           "visibility": "private",
//           "cover": "subjects/jLrPrCwWS6qap2aIjmGV8Qi20mXs1js5CJI2Tb1J.webp",
//           "created_at": "2026-01-23T11:21:55.000000Z",
//           "updated_at": "2026-01-23T11:21:55.000000Z",
//           "assessments": []
//         }
//       ]
//     }
//   ],
//   "student_assessment": [
//     {
//       "id": 4,
//       "user_id": 7,
//       "assessment_id": 1,
//       "status": null,
//       "score": "0.00",
//       "attempted_amount": 0,
//       "created_at": "2026-01-24T02:03:24.000000Z",
//       "updated_at": "2026-01-24T02:03:24.000000Z",
//       "attempts": [
//         {
//           "id": 6,
//           "uuid": null,
//           "student_assessment_id": 4,
//           "status": "draft",
//           "started_at": "2026-01-24T02:03:33.000000Z",
//           "completed_at": null,
//           "sub_score": "0.00",
//           "created_at": "2026-01-24T02:03:24.000000Z",
//           "updated_at": "2026-01-24T02:03:33.000000Z"
//         }
//       ]
//     }
//   ]
// }