<?php

namespace App\Http\Resources\Instructor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }

    // In AssessmentResource.php

//     public function toArray($request)
//     {
//         return [
//             'id' => $this->id,
//             'title' => $this->title,
//             "description" => $this->description,
//             "type" => $this->type,
//             "start_time" => $this->start_time,
//             "end_time" => $this->end_time,
//             "duration" => $this->duration,
//             "max_attempts" => $this->max_attempts,
//             "created_by" => $this->created_by,
//             // "created_at" => $this->created_at,
//             // "updated_at" => $this->updated_at,
//             'student_assessment_attempts' => StudentAssessmentAttemptResource::collection($this->whenLoaded('studentAssessmentAttempts')),
// // "student_assessment_attempts": [
// // {
// // "id": 1,
// // "user_id": 4,
// // "assessment_id": 2,
// // "status": "submitted",
// // "score": 0,
// // "attempted_amount": 2,
// // "created_at": "2026-02-21T02:40:23.000000Z",
// // "updated_at": "2026-02-21T02:55:31.000000Z",
// // "student": {
// // "id": 4,
// // "name": "សុខ​ សិរីវិសាល | Sok sereyvisal",
// // "email": "soksereyvisal@gmail.com",
// // "avatar": null
// // }
// // },
// // {
// // "id": 3,
// // "user_id": 5,
// // "assessment_id": 2,
// // "status": "scored",
// // "score": 25,
// // "attempted_amount": 1,
// // "created_at": "2026-02-21T02:59:50.000000Z",
// // "updated_at": "2026-02-21T03:00:18.000000Z",
// // "student": {
// // "id": 5,
// // "name": "C++ Programming",
// // "email": "teacher@gmail.com",
// // "avatar": null
// // }
// // }
// // ]
            
//             // ... other assessment fields
//             // 'student_assessment_attempts' => $this->flattenedAttempts->map(function ($attempt) {
//             //     return [
//             //         'id' => $attempt->id,
//             //         'user_id' => $attempt->user_id,
//             //         'status' => $attempt->status,
//             //         'score' => $attempt->score,
//             //         'attempted_amount' => $attempt->attempted_amount,
//             //         'student_name' => $attempt->student_name,  // Now flat
//             //         'student_email' => $attempt->student_email, // Now flat
//             //         'updated_at' => $attempt->updated_at,
//             //     ];
//             // }),
//         ];
//     }
}
