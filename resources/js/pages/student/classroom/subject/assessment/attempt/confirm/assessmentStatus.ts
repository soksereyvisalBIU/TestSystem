// utils/assessmentStatus.ts
import dayjs from 'dayjs';
import type {
    Assessment,
    AssessmentAttempt,
    AssessmentStatus,
    StudentAssessment,
} from '../types';

export const getAssessmentStatus = (
    now: dayjs.Dayjs,
    assessment: Assessment,
    summary: StudentAssessment | null,
    attempt: AssessmentAttempt | null,
): AssessmentStatus => {
    if (!now) return 'LOADING';

    const start = dayjs(assessment.start_time);
    const end = dayjs(assessment.end_time);
    const attemptsUsed = summary?.attempted_amount ?? 0;
    const maxAttempts = assessment.max_attempts;
    const hasAttemptsLeft = maxAttempts === 0 || attemptsUsed < maxAttempts;

    if (summary?.status === 'scored' || attempt?.status === 'graded')
        return 'GRADED';

    // 1. Resume Draft (High priority)
    if (attempt?.status === 'draft') return 'RESUME';

    // 2. Time Gates
    if (now.isBefore(start)) return 'UPCOMING';
    if (now.isAfter(end)) return 'EXPIRED';

    // 3. Active Check: If user has attempts left, they can start another even if one is pending/graded
    if (hasAttemptsLeft) return 'ACTIVE';

    // 4. No attempts left: Determine if they are waiting for grades or finished
    if (attempt?.status === 'submitted' && attempt.score === undefined)
        return 'PENDING_GRADING';

    return 'NO_ATTEMPTS_LEFT';
};
