

export interface Assessment {
    id: number;
    title: string;
    description: string;
    type: 'quiz' | 'exam' | 'assignment';
    start_time: string;
    end_time: string;
    status: 'completed' | 'ongoing' | 'upcoming';
    student_status: 'scored' | 'attempted' | 'not_attempted' | 'missed';
    student_score: number | null;
    class_id: number;
    score?: number;
}

export interface Student {
    id: number;
    name: string;
    avatar: string;
    progress: number;
}

export interface Resource {
    id: number;
    name: string;
    type: string;
    size: string;
}

export interface SubjectData {
    id: number;
    name: string;
    description: string;
    cover: string;
    year: string;
    semester: string;
    class_id: number;
    assessments: Assessment[];
}


export interface Question {
    id: number;
    type: string;
    content: string;
    // Add other question fields as needed
}

export interface AssessmentAttemptData {
    id: number;
    title: string;
    duration: number;
    questions: Question[];
}

export interface StudentAttemptData {
    id: number;
    started_at: string;
    status: 'draft' | 'submitted' | 'graded';
}

export interface AttemptStats {
    total: number;
    answered: number;
    progress: number;
    remaining: number;
}


