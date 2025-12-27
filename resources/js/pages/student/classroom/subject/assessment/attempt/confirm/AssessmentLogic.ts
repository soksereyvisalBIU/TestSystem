// import dayjs from 'dayjs';

// export type AssessmentStatus = 
//     | 'LOADING' | 'UPCOMING' | 'ACTIVE' 
//     | 'EXPIRED' | 'RESUME' | 'PENDING_GRADING' 
//     | 'GRADED' | 'NO_ATTEMPTS_LEFT';

// export const getAssessmentStatus = (
//     now: dayjs.Dayjs,
//     assessment: any,
//     summary: any,
//     attempt: any
// ): AssessmentStatus => {
//     if (!now) return 'LOADING';

//     const start = dayjs(assessment.start_time);
//     const end = dayjs(assessment.end_time);
//     const attemptsUsed = summary?.attempted_amount ?? 0;
//     const maxAttempts = assessment.max_attempts;
//     const hasAttemptsLeft = maxAttempts === 0 || attemptsUsed < maxAttempts;

//     if (attempt?.status === 'draft') return 'RESUME';
//     if (now.isBefore(start)) return 'UPCOMING';
//     if (now.isAfter(end)) return 'EXPIRED';
    
//     // Priority: If attempts remain, the status is ACTIVE regardless of previous pending ones
//     if (hasAttemptsLeft) return 'ACTIVE';
    
//     if (attempt?.status === 'submitted' && attempt.score === undefined) return 'PENDING_GRADING';
//     if (summary?.status === 'scored' || attempt?.status === 'graded') return 'GRADED';

//     return 'NO_ATTEMPTS_LEFT';
// };