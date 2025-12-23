import MatchingQuestion from './MatchingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import QAQuestion from './QAQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import { cn } from '@/lib/utils';

interface Props {
    question: any;
    index: number;
    answer: any; // Renamed from value to match parent
    onAnswerChange: (id: string, value: any) => void; // Standardized signature
    disabled?: boolean;
}

export default function QuestionRenderer({
    question,
    index,
    answer,
    onAnswerChange,
    disabled = false,
}: Props) {
    // We remove the card styling here because QuestionCard.tsx 
    // is now the primary container for the UI layout.
    return (
        <div className={cn(
            "w-full transition-all duration-300",
            disabled && "pointer-events-none opacity-60"
        )}>
            {/* Note: We removed the H2 question text from here 
               because it's already rendered in the parent QuestionCard 
            */}

            <div className="mt-4">
                {question.type === 'true_false' && (
                    <TrueFalseQuestion
                        q={question}
                        value={answer}
                        onChange={(val: any) => onAnswerChange(question.id, val)}
                    />
                )}

                {question.type === 'multiple_choice' && (
                    <MultipleChoiceQuestion
                        q={question}
                        value={answer}
                        onChange={(val: any) => onAnswerChange(question.id, val)}
                    />
                )}

                {question.type === 'matching' && (
                    <MatchingQuestion
                        q={question}
                        value={answer}
                        onChange={(val: any) => onAnswerChange(question.id, val)}
                    />
                )}

                {question.type === "short_answer" && (
                    <QAQuestion 
                        q={question} 
                        value={answer} 
                        onChange={(val: any) => onAnswerChange(question.id, val)} 
                    />
                )}
            </div>
        </div>
    );
}