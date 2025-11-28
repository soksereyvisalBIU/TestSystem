<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Instructor\QuestionResource;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($assessmentId)
    {

        // return response()->json('vi');

        $questions = QuestionResource::collection(Question::with(relations: 'options')->where('assessment_id', $assessmentId)->orderBy('order')->get());

        return response()->json(['data' => $questions]);
    }

    public function store(Request $request, $assessmentId)
    {
        // Validate request data
        $validated = $this->validateData($request);

        // Create the base question
        $question = Question::create([
            'assessment_id' => $assessmentId,
            'type' => $validated['type'],
            'question_text' => $validated['question'],
            'point' => $validated['point'],
            'order' => $validated['order'] ?? null
        ]);

        // Handle options based on type
        switch ($validated['type']) {
            case 'true_false':
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => 'True',
                    'is_correct' => $validated['answer'] === 'true',
                ]);
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => 'False',
                    'is_correct' => $validated['answer'] === 'false',
                ]);
                break;

            case 'fill_blank':
            case 'short_answer':
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => $validated['answer'],
                    'is_correct' => true,
                ]);
                break;

            case 'multiple_choice':
                foreach ($validated['options'] as $opt) {
                    Option::create([
                        'question_id' => $question->id,
                        'option_text' => $opt,
                        'is_correct' => $opt === $validated['answer'],
                    ]);
                }
                break;

            case 'matching':
                foreach ($validated['answer'] as $pair) {
                    Option::create([
                        'question_id' => $question->id,
                        'option_text' => $pair['right'],
                        'match_key' => $pair['left'],
                        'is_correct' => true,
                    ]);
                }
                break;
        }

        // Load options to include them in the response
        $question->load('options');

        return response()->json([
            'status' => true,
            'message' => 'Question created successfully.',
            'data' => $question,
        ], 201);
    }

    public function show($assessmentId, Question $question)
    {
        return response()->json(['data' => $question]);
    }

    public function update(Request $request, $assessmentId, Question $question)
    {
        // 🔹 Ensure the question belongs to this assessment
        if ($question->assessment_id != $assessmentId) {
            return response()->json([
                'status' => false,
                'message' => 'This question does not belong to the specified assessment.',
            ], 403);
        }

        // 🔹 Validate input (reuse same validation logic)
        $validated = $this->validateData($request);

        // 🔹 Update question base info
        $question->update([
            'type' => $validated['type'],
            'question_text' => $validated['question'],
            'point' => $validated['point'],
            'order' => $validated['order'] ?? null
        ]);

        // 🔹 Remove old options to avoid conflicts
        $question->options()->delete();

        // 🔹 Recreate options depending on question type
        switch ($validated['type']) {
            case 'true_false':
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => 'True',
                    'is_correct' => $validated['answer'] === 'true',
                ]);
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => 'False',
                    'is_correct' => $validated['answer'] === 'false',
                ]);
                break;

            case 'fill_blank':
            case 'short_answer':
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => $validated['answer'],
                    'is_correct' => true,
                ]);
                break;

            case 'multiple_choice':
                foreach ($validated['options'] as $opt) {
                    Option::create([
                        'question_id' => $question->id,
                        'option_text' => $opt,
                        'is_correct' => $opt === $validated['answer'],
                    ]);
                }
                break;

            case 'matching':
                foreach ($validated['answer'] as $pair) {
                    Option::create([
                        'question_id' => $question->id,
                        'option_text' => $pair['right'],
                        'match_key' => $pair['left'],
                        'is_correct' => true,
                    ]);
                }
                break;
        }

        // 🔹 Reload updated question with options
        $question->load('options');

        return response()->json([
            'status' => true,
            'message' => 'Question updated successfully.',
            'data' => $question,
        ]);
    }


    public function destroy($assessmentId, Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'Question deleted successfully']);
    }

    // ✅ Validation logic per question type
    private function validateData(Request $request, $id = null)
    {
        $rules = [
            'type' => ['required', Rule::in(['true_false', 'fill_blank', 'multiple_choice', 'matching', 'short_answer'])],
            'question' => ['required', 'string'],
            'point' => ['required'],
            'order' => ['integer']
        ];

        $type = $request->input('type');

        switch ($type) {
            case 'true_false':
                $rules['answer'] = ['required', Rule::in(['true', 'false'])];
                break;

            case 'fill_blank':
                $rules['answer'] = ['required', 'string'];
                break;

            case 'multiple_choice':
                $rules['options'] = ['required', 'array', 'min:2'];
                $rules['options.*'] = ['string'];
                $rules['answer'] = ['required', 'string', Rule::in($request->input('options', []))];
                break;

            case 'matching':
                $rules['answer'] = ['required', 'array', 'min:1'];
                foreach ($request->input('answer', []) as $key => $pair) {
                    $rules["answer.$key.left"] = ['required', 'string'];
                    $rules["answer.$key.right"] = ['required', 'string'];
                }
                break;

            case 'short_answer':
                $rules['answer'] = ['required', 'string'];
                break;
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        return $validator->validated();
    }
}
