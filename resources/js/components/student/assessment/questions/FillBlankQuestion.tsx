import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquareText } from 'lucide-react'; // Icon for visual appeal

export default function ShortAnswerQuestion({ question, answer, onChange }) {
    return (
        // Wrapper for the entire question with card styling
        <div className="w-full p-6 border rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl space-y-4">
            
            {/* Question Text with improved hierarchy */}
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 leading-snug border-b pb-3 mb-3">
                <MessageSquareText className="w-6 h-6 text-blue-600" />
                {question.text}
            </h3>

            {/* Instruction Label */}
            <Label htmlFor={`${question.id}-answer`} className="text-base font-semibold text-gray-700 block">
                Your Answer
            </Label>

            {/* Textarea with enhanced styling and properties */}
            <Textarea
                id={`${question.id}-answer`}
                rows={5} // Slightly more rows for typical short answers
                value={answer || ""}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder="Type your detailed response here..."
                className="
                    min-h-[150px]
                    w-full 
                    p-4 
                    text-base 
                    rounded-lg 
                    border-2 
                    border-gray-300 
                    focus-visible:ring-4 
                    focus-visible:ring-blue-200 
                    focus-visible:border-blue-500 
                    transition-all 
                    duration-200
                "
            />
            
            {/* Optional: Add a subtle character count indicator for usability */}
            <p className="text-sm text-right text-gray-500">
                {answer ? answer.length : 0} characters
            </p>
        </div>
    );
}