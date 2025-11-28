<?php

namespace App\Http\Resources\Instructor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the loaded options collection. Use the attribute directly 
        // after confirming the relationship is eager loaded (Solution 1).
        $options = $this->options ?? collect();

        // Check if options are loaded before proceeding with complex logic
        if ($options->isEmpty()) {
            // Return minimal data if options are missing or not loaded
            return [

                'id' => (string) $this->id,
                'assessment_id' => (string) $this->assessment_id,
                'question' => $this->question_text,
                'type' => $this->type,
                'point' => (float) $this->point,
                'order' => (float) $this->order,
                'answer' => null,
                'options' => null,
                'allow_file_upload' => $this->allow_file_upload,
                'allow_code_submission' => $this->allow_code_submission,
            ];
        }

        // 1. Determine the correct answer(s)
        $answer = $this->getFrontendAnswer($options);

        // 2. Format the options array
        $formattedOptions = $this->getFormattedOptions($options);

        return [
            // Standard Fields
            'id' => (string) $this->id,
            'assessment_id' => (string) $this->assessment_id,
            'question' => $this->question_text,
            'type' => $this->type,
            'point' => (float) $this->point,
            'order' => (float) $this->order,

            // Data Transformation Fields
            'answer' => $answer,
            'options' => $formattedOptions,

            // Other fields
            'allow_file_upload' => $this->allow_file_upload,
            'allow_code_submission' => $this->allow_code_submission,
        ];
    }

    /**
     * Get the correct answer formatted for the frontend.
     */
    protected function getFrontendAnswer($options): mixed
    {
        $correctOptions = $options->where('is_correct', 1);

        return match ($this->type) {
            'true_false' => $correctOptions->pluck('option_text')->first() === 'True' ? 'true' : 'false',
            'multiple_choice', 'short_answer', 'fill_blank' => $correctOptions->pluck('option_text')->first(),
            'matching' => $correctOptions->map(function ($option) {
                return [
                    'left' => $option->match_key,
                    'right' => $option->option_text,
                ];
            })->values()->toArray(),
            default => null,
        };
    }

    /**
     * Get the options formatted for the frontend.
     */
    protected function getFormattedOptions($options): mixed
    {
        return match ($this->type) {
            'multiple_choice', 'true_false' => $options->pluck('option_text')->values()->toArray(),
            // For matching, the options are part of the 'answer' field on the frontend, 
            // but if you need the full list of options, you can return them here.
            'matching' => null, // Frontend doesn't explicitly list 'options' separate from 'answer' for matching
            default => null,
        };
    }
}
