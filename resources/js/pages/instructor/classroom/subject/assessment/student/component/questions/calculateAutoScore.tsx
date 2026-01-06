export const calculateAutoScore = (question, answers = []) => {
    const maxPoints = Math.max(0, parseFloat(question.point || 0));

    let earnedPoints = 0;
    let status = 'unanswered';

    if (
        !answers ||
        answers.length === 0 ||
        (!answers[0].answer_text && !answers[0].option_id)
    ) {
        return { earnedPoints: 0, maxPoints, status: 'unanswered' };
    }

    const normalize = (str) => (str ?? '').toString().trim().toLowerCase();

    switch (question.type) {
        case 'true_false':
        case 'multiple_choice': {
            const studentAns = answers[0];
            const correctOption = question.options?.find(
                (opt) => opt.is_correct === 1,
            );
            if (
                correctOption &&
                normalize(studentAns.answer_text) ===
                    normalize(correctOption.option_text)
            ) {
                earnedPoints = maxPoints;
                status = 'correct';
            } else {
                status = 'incorrect';
            }
            break;
        }
        case 'matching': {
            const options = question.options || [];
            const totalPairs = options.length;
            if (totalPairs === 0) break;

            let correctCount = 0;
            options.forEach((opt) => {
                const ans = answers.find((a) => a.option_id === opt.id);
                if (ans && ans.answer_text === opt.option_text) correctCount++;
                // if (ans && ans.answer_text === opt.match_key) correctCount++;
            });

            earnedPoints = (correctCount / totalPairs) * maxPoints;
            if (correctCount === totalPairs) status = 'correct';
            else if (correctCount > 0) status = 'partial';
            else status = 'incorrect';
            break;
        }
        case 'fill_blank':
        case 'short_answer': {
            const studentText = normalize(answers[0]?.answer_text);
            const isMatch = question.options?.some(
                (opt) =>
                    opt.is_correct === 1 &&
                    normalize(opt.option_text) === studentText,
            );

            if (answers[0]?.points_earned > 0) {
                earnedPoints = Math.min(answers[0].points_earned, maxPoints);
                status = earnedPoints === maxPoints ? 'correct' : 'partial';
                break;
            }

            if (isMatch) {
                earnedPoints = maxPoints;
                status = 'correct';
            } else {
                earnedPoints = 0;
                status = studentText ? 'review' : 'unanswered';
            }
            break;
        }
        default:
            status = 'review';
            break;
    }

    return {
        earnedPoints: Math.round((earnedPoints + Number.EPSILON) * 100) / 100,
        maxPoints: parseFloat(maxPoints.toFixed(2)),
        status,
    };
};
