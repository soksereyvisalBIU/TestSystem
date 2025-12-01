import MatchingQuestion from "./MatchingQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import QAQuestion from "./QAQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";


interface Props {
    question: any;
    index: number;
    value: any;
    onChange: (id: number, value: any, isMultiple?: boolean) => void;
    answers: Record<number, any>;
    setData: (key: string, value: any) => void;
}

export default function QuestionRenderer({ question, index, value, onChange, answers, setData }: Props) {
    return (
        <div className="space-y-3 rounded-lg border bg-background p-4 shadow-sm">
            <h2 className="font-medium">
                Q{index + 1}. {question.question_text}{' '}
                <span className="text-xs text-muted-foreground">({question.points} pts)</span>
            </h2>

            {question.question_type === 'truefalse' && (
                <TrueFalseQuestion q={question} value={value} onChange={onChange} />
            )}

            {question.question_type === 'multiple' && (
                <MultipleChoiceQuestion q={question} value={value} onChange={onChange} />
            )}

            {question.question_type === 'matching' && (
                <MatchingQuestion q={question} answers={answers} setData={setData} />
            )}

            {question.question_type === 'qa' && <QAQuestion q={question} value={value} onChange={onChange} />}
        </div>
    );
}
