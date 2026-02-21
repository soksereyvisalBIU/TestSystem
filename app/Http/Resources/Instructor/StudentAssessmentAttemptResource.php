<?php

namespace App\Http\Resources\Instructor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentAssessmentAttemptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            // {
            // "id": 1,
            // "user_id": 4,
            // "assessment_id": 2,
            // "status": "submitted",
            // "score": 0,
            // "attempted_amount": 2,
            // "created_at": "2026-02-21T02:40:23.000000Z",
            // "updated_at": "2026-02-21T02:55:31.000000Z",
            // "student": {
            // "id": 4,
            // "name": "សុខ​ សិរីវិសាល | Sok sereyvisal",
            // "email": "soksereyvisal@gmail.com",
            // "avatar": null
            // }
            'id' => $this->id,
            // 'user_id' => $this->user_id,
            'assessment_id' => $this->assessment_id,
            'status' => $this->status,
            'score' => $this->score,
            'attempted_amount' => $this->attempted_amount,
            // 'created_at' => $this->created_at,
            // 'updated_at' => $this->updated_at,
            'student' => $this->whenLoaded('student'),
        ];
    }
}
