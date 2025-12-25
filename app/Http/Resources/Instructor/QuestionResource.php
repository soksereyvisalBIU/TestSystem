<?php

namespace App\Http\Resources\Instructor;

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

            // Data Transformation
            'answer'        => $options->isNotEmpty() ? $this->getFrontendAnswer($options) : null,
            'options'       => $options->isNotEmpty() ? $this->getFormattedOptions($options) : null,

            // Submission Settings - Flattened and safely loaded
            $this->mergeWhen($this->whenLoaded('submissionSetting'), function () {
                return [
                    'allow_file_upload'     => $this->submissionSetting->allow_file_upload,
                    'allow_code_submission' => $this->submissionSetting->allow_code_submission,
                    'accepted_file_types'   => $this->submissionSetting->accepted_file_types,
                    'max_file_size'         => $this->submissionSetting->max_file_size,
                ];
            }),

            // Media
            'media' => $this->whenLoaded('media'),
        ];
    }

    protected function getFrontendAnswer($options): mixed
    {
        $correctOptions = $options->where('is_correct', 1);

        return match ($this->type) {
            'true_false'      => strtolower($correctOptions->first()?->option_text) === 'true' ? 'true' : 'false',
            'multiple_choice', 
            'short_answer', 
            'fill_blank'      => $correctOptions->first()?->option_text,
            'matching'        => $correctOptions->map(fn($opt) => [
                                    'left'  => $opt->match_key,
                                    'right' => $opt->option_text,
                                 ])->values()->all(),
            default           => null,
        };
    }

    protected function getFormattedOptions($options): ?array
    {
        return match ($this->type) {
            'multiple_choice', 
            'true_false' => $options->pluck('option_text')->all(),
            default      => null,
        };
    }
}