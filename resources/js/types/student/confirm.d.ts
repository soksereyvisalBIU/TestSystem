// types.ts
export interface Assessment {
    id: number;
    title: string;
    description: string | null;
    type: string;
    start_time: string;
    end_time: string;
    duration: number;
    max_attempts: number; // 0 = unlimited
    max_score?: number;
}

export interface StudentAssessment {
    score: number | null;
    status: string;
    attempted_amount: number;
}

export interface AssessmentAttempt {
    id: number;
    status: 'draft' | 'submitted' | 'graded' | string | null;
    score?: number;
    completed_at?: string;
}

export interface DashboardProps {
    assessment: Assessment;
    class_id: number;
    subject_id: number;
    studentAssessment: StudentAssessment | null;
    studentAssessmentAttempt: AssessmentAttempt | null;
}

export type AssessmentStatus =
    | 'LOADING'
    | 'UPCOMING'
    | 'ACTIVE'
    | 'EXPIRED'
    | 'RESUME'
    | 'PENDING_GRADING'
    | 'GRADED'
    | 'NO_ATTEMPTS_LEFT';