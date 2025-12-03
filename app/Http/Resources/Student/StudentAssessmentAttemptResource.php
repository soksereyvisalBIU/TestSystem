<?php

namespace App\Http\Resources\Student;

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
        return [
            'student_assesment_id' => $this->student_assesment_id,
            'status' => $this->status,
            'started_at' => $this->started_at,
            'completed_at' => $this->completed_at,
            'sub_score' => $this->sub_score,

            'assessment' => AssessmentResource::make($this->whenLoaded('assessment')),
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
            'answers' => AnswerResource::collection($this->whenLoaded('answers')),
        ];
    }

    //    $assessmentAttemptResource = new StudentAssessmentAttemptResource(StudentAssessmentAttempt::with('studentAssessment' , 'assessment.questions' , 'answers')->findOrFail($request->student_assessment_attempt_id));

}
