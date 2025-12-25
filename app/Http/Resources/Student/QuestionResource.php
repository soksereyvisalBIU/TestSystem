<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $options = $this->relationLoaded('options') ? $this->options : collect();

        return [
            'id'            => (string) $this->id,
            'assessment_id' => (string) $this->assessment_id,
            'question'      => $this->question_text,
            'type'          => $this->type,
            'point'         => (float) $this->point,
            'order'         => (int) $this->order,

            'options'       => $options->isNotEmpty() ? $this->getFormattedOptions($options) : null,

            // Fix: Added null-safe check inside the merge closure
            $this->mergeWhen($this->relationLoaded('submissionSetting') && $this->submissionSetting, function () {
                return [
                    'allow_file_upload'     => $this->submissionSetting->allow_file_upload,
                    'allow_code_submission' => $this->submissionSetting->allow_code_submission,
                    'accepted_file_types'   => $this->submissionSetting->accepted_file_types,
                    'max_file_size'         => $this->submissionSetting->max_file_size,
                ];
            }),

            'media' => $this->whenLoaded('media'),
        ];
    }

    protected function getFormattedOptions($options): mixed
    {
        return match ($this->type) {
            'multiple_choice', 'true_false' => $options->map(fn($opt) => [
                'id'   => (string) $opt->id,
                'text' => $opt->option_text,
            ])->values()->all(),

            'matching' => [
                'left' => $options->map(fn($opt) => [
                    'id'   => (string) $opt->id,
                    'text' => $opt->match_key,
                ])->values()->all(),
                
                'right' => $options->map(fn($opt) => [
                    'text' => $opt->option_text,
                ])->shuffle()->values()->all(),
            ],

            default => null,
        };
    }
}