<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // 'attempt_id' => $this->attempt_id,
            // 'question_id' => $this->question_id,
            // 'answer_text' => $this->answer_text,
            // 'selected_option_id' => $this->selected_option_id,
            // 'file_path' => $this->file_path,
            // 'code_submission' => $this->code_submission,
            // 'is_correct' => $this->is_correct,
            // 'points_awarded' => $this->points_awarded,
            // 'student_assessment_attempt_id' => $this->student_assessment_attempt_id,
            // 'option_id' => $this->option_id,

            // 'student_assessment_attempt_id' => $this->student_assessment_attempt_id,
            'student_assessment_attempt' => $this->whenLoaded('studentAssessmentAttempt'),
            // 'student_assessment_attempt' => $this->whenLoaded('studentAssessmentAttempt'),
            // 'attempt_id' => $this->attempt_id,
            'question_id' => $this->question_id,
            'option_id' => $this->option_id,
            // 'selected_option_id' => $this->selected_option_id,
            'answer_text' => $this->answer_text,
            // 'code_language' => $this->code_language,
            'points_earned' => $this->points_earned,
        ];
    }
}
