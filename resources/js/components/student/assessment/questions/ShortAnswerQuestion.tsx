import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquareText } from 'lucide-react'; // Icon for visual appeal

const MAX_CHARACTERS = 500; // Define a reasonable max character limit

export default function ShortAnswerQuestion({ question, answer, onChange }) {
    const currentLength = (answer || "").length;
    const isOverLimit = currentLength > MAX_CHARACTERS;

    const handleTextChange = (e) => {
        const newValue = e.target.value;
        // Optionally enforce the limit (though typically just warn the user)
        // if (newValue.length <= MAX_CHARACTERS) {
        //     onChange(question.id, newValue);
        // } else {
        //     onChange(question.id, newValue.substring(0, MAX_CHARACTERS));
        // }
        onChange(question.id, newValue);
    };

    return (
        // Wrapper for the entire question with card styling
        <div className="w-full p-6 border rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl space-y-4">
            
            {/* Question Text with improved hierarchy */}
            <h3 className="flex items-start gap-3 text-xl font-bold text-gray-900 leading-snug border-b pb-4 mb-2">
                <MessageSquareText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                {question.text}
            </h3>

            {/* Instruction Label */}
            <Label htmlFor={`${question.id}-answer`} className="text-base font-semibold text-gray-700 block pt-2">
                Your Response
            </Label>

            {/* Textarea with enhanced styling and properties */}
            <Textarea
                id={`${question.id}-answer`}
                rows={5} // Slightly more rows for typical short answers
                value={answer || ""}
                onChange={handleTextChange}
                placeholder="Type your detailed response here..."
                // Apply error border/ring if character limit is exceeded
                className={`
                    min-h-[150px]
                    w-full 
                    p-4 
                    text-base 
                    rounded-lg 
                    border-2 
                    focus-visible:ring-4 
                    transition-all 
                    duration-200
                    ${
                        isOverLimit
                            ? 'border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500 text-red-700'
                            : 'border-gray-300 focus-visible:ring-blue-200 focus-visible:border-blue-500'
                    }
                `}
            />
            
            {/* Character count indicator */}
            <div className="text-sm text-right">
                <span className={`font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {currentLength} / {MAX_CHARACTERS} characters
                </span>
                {isOverLimit && (
                    <p className="text-red-500 mt-1">
                        Maximum limit exceeded. Please shorten your response.
                    </p>
                )}
            </div>
        </div>
    );
}