<?php

namespace App\Http\Resources\Student;

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
                'assessment' => $this->whenLoaded('assessment'),
                // 'assessment_id' => (string) $this->assessment_id,
                'question' => $this->question_text,
                'type' => $this->type,
                'point' => (float) $this->point,
                'order' => (float) $this->order,
                // 'answer' => null,
                'options' => null,
                'allow_file_upload' => $this->allow_file_upload,
                'allow_code_submission' => $this->allow_code_submission,
            ];
        }

        // 1. Determine the correct answer(s)
        $matching = $this->getFrontendAnswer($options);

        // 2. Format the options array
        $formattedOptions = $this->getFormattedOptions($options);

        return [
            // Standard Fields
            'id' => (string) $this->id,
            'assessment' => $this->whenLoaded('assessment'),
            // 'assessment_id' => (string) $this->assessment_id,
            'question' => $this->question_text,
            'type' => $this->type,
            'point' => (float) $this->point,
            'order' => (float) $this->order,

            // Data Transformation Fields
            // 'answer' => $answer,
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
            // 'matching' => $correctOptions->map(function ($option) {
            //     return [
            //         'left' => $option->match_key,
            //         'right' => $option->option_text,
            //     ];
            // })->values()->toArray(),
            default => null,
        };
    }

    /**
     * Get the options formatted for the frontend.
     */
    protected function getFormattedOptions($options): mixed
    {
        return match ($this->type) {
            'multiple_choice', 'true_false' => $options->map(fn($opt) => [
                'id' => $opt->id,
                'text' => $opt->option_text,
            ])->values()->toArray(),

            'matching' => (function () use ($options) {

                // LEFT SIDE (match_key)
                $left = $options->map(fn($opt) => [
                    'id' => $opt->id,
                    'text' => $opt->match_key,
                ])->values()->toArray();

                // RIGHT SIDE (option_text) — shuffled
                $right = $options->map(fn($opt) => [
                    // 'id' => $opt->id,
                    'text' => $opt->option_text,
                ])->shuffle()->values()->toArray();

                return [
                    'left' => $left,
                    'right' => $right,
                ];
            })(),

            default => null,
        };
    }


    // protected function getFormattedOptions($options): mixed
    // {
    //     return match ($this->type) {
    //         'multiple_choice', 'true_false' => $options->pluck('option_text')->values()->toArray(),

    //         'matching' => (function () use ($options) {
    //             $left = $options->pluck('match_key')->values()->toArray();
    //             $right = $options->pluck('option_text')->shuffle()->values()->toArray();

    //             // Combine them so frontend can randomize matching choices independently
    //             return [
    //                 'left' => $left,
    //                 'right' => $right,
    //             ];
    //         })(),

    //         default => null,
    //     };
    // }

}
