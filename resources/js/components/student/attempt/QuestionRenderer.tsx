import MatchingQuestion from './MatchingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import QAQuestion from './QAQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';

interface Props {
    question: any;
    index: number;
    value: any;
    onChange: (id: number, value: any, isMultiple?: boolean) => void;
    answers: Record<number, any>;
    setData: (key: string, value: any) => void;
}

export default function QuestionRenderer({
    question,
    index,
    value,
    onChange,
    answers,
    setData,
}: Props) {
    console.log('question', question);

    return (
        <div className="space-y-3 rounded-lg border bg-background p-4 shadow-sm">
            <h2 className="font-medium">
                {index + 1}. {question.question_text}{' '}
                <span className="text-xs text-muted-foreground">
                    ({question.points} pts)
                </span>
            </h2>

            {question.type === 'true_false' && (
                <TrueFalseQuestion
                    q={question}
                    value={value}
                    onChange={onChange}
                />
            )}

            {question.type === 'multiple_choice' && (
                <MultipleChoiceQuestion
                    q={question}
                    value={value}
                    onChange={onChange}
                />
            )}

            {question.type === 'matching' && (
                <MatchingQuestion
                    q={question}
                    answers={answers}
                    setData={setData}
                />
            )}

            {question.type === "short_answer" && (
                <QAQuestion q={question} value={value} onChange={onChange} />
            )}
        </div>
    );
}
