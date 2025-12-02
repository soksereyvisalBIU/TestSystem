import FillBlankQuestion from "./questions/FillBlankQuestion";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import MatchingQuestion from "./questions/MatchingQuestion";
import ShortAnswerQuestion from "./questions/ShortAnswerQuestion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex gap-3">
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span>{question.question}</span>
                </CardTitle>
            </CardHeader>

            <CardContent>{renderByType()}</CardContent>
        </Card>
    );
}
