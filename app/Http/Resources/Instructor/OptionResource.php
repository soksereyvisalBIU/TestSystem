<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OptionResource extends JsonResource
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
            'id' => $this->id,
            'option_text' => $this->option_text,
            'side' => $this->side,
            'match_key' => $this->match_key,
            'is_correct' => $this->is_correct,
            'question' => $this->whenLoaded('question'),
        ];

    }

}
