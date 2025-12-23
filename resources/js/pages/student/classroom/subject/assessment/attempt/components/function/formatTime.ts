// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import { AttemptStats } from "@/types/student/assessment";

export const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
};

export const calculateRemainingTime = (
    startedAt: string,
    durationMinutes: number,
): number => {
    const start = new Date(startedAt).getTime();
    const durationSec = durationMinutes * 60;
    return Math.max(0, durationSec - Math.floor((Date.now() - start) / 1000));
};

export const calculateStats = (
    answers: Record<string, any>,
    totalQuestions: number,
): AttemptStats => {
    const answered = Object.keys(answers).filter(
        (id) => answers[id] !== null && answers[id] !== '',
    ).length;
    return {
        total: totalQuestions,
        answered,
        progress: (answered / totalQuestions) * 100,
        remaining: totalQuestions - answered,
    };
};
