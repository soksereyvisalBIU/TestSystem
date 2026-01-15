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
        // Mapping types to components to keep the return clean
        const questionComponents = {
            fill_blank: FillBlankQuestion,
            true_false: TrueFalseQuestion,
            multiple_choice: MultipleChoiceQuestion,
            matching: MatchingQuestion,
            short_answer: ShortAnswerQuestion,
            fileupload: FileUploadQuestion,
        };

        const Component = questionComponents[question.type];

        if (!Component) {
            return (
                <div className="p-4 border-2 border-dashed border-destructive/20 rounded-xl text-center text-xs text-destructive uppercase font-bold">
                    Unsupported Question Type: {question.type}
                </div>
            );
        }

        return (
            <Component
                question={question}
                answer={answer}
                onChange={onAnswerChange}
            />
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-4 sm:space-y-6">
            {/* Question Header */}
            <div className="flex flex-col xs:flex-row items-start sm:items-center gap-1 xs:gap-3 sm:gap-4 px-1">
                {/* Index Badge - Compact for XS */}
                {/* <div className="flex items-center gap-2 xs:block">
                    <span className="text-sm xs:text-lg font-black text-primary/40 tabular-nums">
                        Q{index + 1}: 
                    </span>
                    Tiny visual separator only visible on mobile stack
                    <div className="h-[1px] w-4 bg-border xs:hidden" />
                </div> */}

                {/* Question text with Khmer support */}
                {/* <h2 className="khmerfont text-base xs:text-lg sm:text-xl leading-relaxed font-black tracking-tight text-title">
                    {question.question}
                </h2> */}
                <div className="khmerfont text-base xs:text-lg sm:text-xl leading-relaxed font-bold tracking-tight text-title" dangerouslySetInnerHTML={{ __html: question.question }} />
                {/* {console.log(question.question)} */}
            </div>

            {/* Answer Input Area */}
            <div className="relative">
                {renderByType()}
            </div>

            {/* Visual Progress Indicator (Optional) */}
            <div className="flex justify-center gap-1">
                <div className="h-1 w-8 rounded-full bg-primary/10 overflow-hidden">
                    <div 
                        className="h-full bg-primary/40 transition-all duration-300" 
                        style={{ width: answer ? '100%' : '0%' }}
                    />
                </div>
            </div>
        </div>
    );
}