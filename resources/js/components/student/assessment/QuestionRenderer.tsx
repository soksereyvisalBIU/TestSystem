import FillBlankQuestion from "./questions/FillBlankQuestion";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import MatchingQuestion from "./questions/MatchingQuestion";
import ShortAnswerQuestion from "./questions/ShortAnswerQuestion";
import FileUploadQuestion from "./questions/FileUploadQuestion";

export default function QuestionRenderer({ question, index, answer, onAnswerChange }) {  

    const renderByType = () => {
        switch (question.type) {
            case "fill_blank":
                return <FillBlankQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            case "true_false":
                return <TrueFalseQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            case "multiple_choice":
                return <MultipleChoiceQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            case "matching":
                return <MatchingQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            case "short_answer":
                return <ShortAnswerQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            case "fileupload":
                return <FileUploadQuestion question={question} answer={answer} onChange={onAnswerChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 sm:pt-2">
            {/* Question Text Styling */}
            <div className="flex gap-2 sm:gap-4 ">
                <span className="text-lg md:text-xl font-black text-description/40 tabular-nums">
                    Q{index + 1}:
                </span>
                <h2 className="text-lg md:text-xl font-black tracking-tight text-title leading-relaxed khmerfont">
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