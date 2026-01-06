import FileUploadQuestion from './questions/FileUploadQuestion';
import FillBlankQuestion from './questions/FillBlankQuestion';
import MatchingQuestion from './questions/MatchingQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import ShortAnswerQuestion from './questions/ShortAnswerQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';

export default function QuestionRenderer({
    question,
    index,
    answer,
    onAnswerChange,
}) {
    const renderByType = () => {
        switch (question.type) {
            case 'fill_blank':
                return (
                    <FillBlankQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            case 'true_false':
                return (
                    <TrueFalseQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            case 'multiple_choice':
                return (
                    <MultipleChoiceQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            case 'matching':
                return (
                    <MatchingQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            case 'short_answer':
                return (
                    <ShortAnswerQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            case 'fileupload':
                return (
                    <FileUploadQuestion
                        question={question}
                        answer={answer}
                        onChange={onAnswerChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 sm:pt-2">
            {/* Question Text Styling */}
            <div className="flex gap-2 sm:gap-4">
                <span className="text-lg font-black text-description/40 tabular-nums md:text-xl">
                    Q{index + 1}:
                </span>
                <h2 className="khmerfont text-lg leading-relaxed font-black tracking-tight text-title md:text-xl">
                    {question.question}
                </h2>
            </div>

            {/* Answer Input Area */}
            <div className="relative rounded-3xl transition-all">
                {renderByType()}
            </div>
        </div>
    );
}
