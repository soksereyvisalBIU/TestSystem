// ========================
// Types
// ========================
export interface Option {
    id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean | number;
    side?: number;
}

export interface Question {
    id: number;
    question_text: string;
    type: 'multiple_choice'| 'fill_blank' | 'true_false' | 'short_answer' | 'matching';
    points: number | string;
    options?: Option[];
}

export interface Answer {
    id: number;
    question_id: number;
    option_id: number | null;
    matching_id: number | null;
    answer_text: string | null;
    points_earned: number | string | null;

    // The backend may not include these, so mark as optional:
    question?: Question | null;
    option?: Option | null;
}

export interface Assessment {
    id: number;
    title: string;
    description: string;
    questions?: Question[];
}

export interface Attempt {
    id: number;
    started_at: string;
    submitted_at: string;
    score: number | string | null;
    status: string;
    assessment: Assessment;
    answers: Answer[];
}
