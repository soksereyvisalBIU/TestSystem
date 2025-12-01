// import echo from '@/echo.js';
import echo from '@/echo';
import { useEffect, useState } from 'react';

export default function useAssessmentScore(initialAttempt: any) {
    const [attempt, setAttempt] = useState(initialAttempt);
    const attemptId = initialAttempt?.id;

    useEffect(() => {
        if (!attemptId) return;

        echo.private(`attempts.${attemptId}`).listen(
            'ScoreUpdated',
            (e: any) => {
                const updated = e.assessmentAttempt;

                // if no answers in either side, just shallow merge
                if (!attempt?.answers || !updated?.answers) {
                    setAttempt({ ...attempt, ...updated });
                    return;
                }

                // otherwise merge answers carefully
                const mergedAnswers = updated.answers.map((a: any) => {
                    const existing = attempt.answers.find(
                        (ex: any) => ex.id === a.id,
                    );
                    return { ...existing, ...a };
                });

                setAttempt({
                    ...attempt,
                    ...updated,
                    answers: mergedAnswers,
                });
            },
        );

        return () => {
            echo.leave(`attempts.${attemptId}`);
        };
    }, [attemptId, attempt]);

    return attempt;
}
