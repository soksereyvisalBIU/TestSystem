import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle } from 'lucide-react'; // Icon for selected state

// Utility function to generate sequential labels (A, B, C, ...)
const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MultipleChoiceQuestion({ question, answer, onChange }) {
    // Assuming 'answer' is the selected option value (e.g., opt.id or opt.text)
    const answerValue = answer || "";

    return (
        <div className="w-full p-6 border rounded-2xl bg-gray-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
            {/* Question Text with clear hierarchy and styling */}
            <h3 className="text-xl font-bold text-gray-900 mb-5 leading-snug">
                {question.text}
            </h3>

            {/* Radio Group: Using flex-col and space-y for clear option stacking */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answerValue}
                className="space-y-3"
            >
                {question.options.map((opt, index) => {
                    // We assume the value passed to onValueChange is a simple string, 
                    // e.g., opt.id or opt.text. I will use opt.text as the value for simplicity.
                    const optionValue = opt.text;
                    const isSelected = answerValue === optionValue;
                    const optionLabel = getOptionLabel(index);

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`
                                flex items-center justify-between gap-4 
                                p-4 rounded-xl border-2 cursor-pointer 
                                text-base font-medium 
                                transition-all duration-200 ease-in-out
                                bg-white 
                                shadow-sm
                                hover:bg-gray-100 hover:border-gray-400
                                ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-lg ring-4 ring-blue-200'
                                        : 'border-gray-300 text-gray-800'
                                }
                            `}
                        >
                            {/* Left side: Option Letter and Text */}
                            <div className="flex items-center gap-4 flex-grow">
                                <span className={`
                                    flex items-center justify-center 
                                    w-8 h-8 rounded-full border 
                                    text-sm font-bold 
                                    ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-200'}
                                `}>
                                    {optionLabel}
                                </span>
                                <span className="flex-grow">{opt.text}</span>
                            </div>

                            {/* Right side: Radio Button and Check Icon */}
                            <div className="relative">
                                {/* Visually hidden RadioGroupItem */}
                                <RadioGroupItem
                                    id={`${question.id}-${opt.id}`}
                                    value={optionValue}
                                    className="sr-only" 
                                />
                                
                                {/* Custom Checkmark Icon for selected state */}
                                {isSelected && (
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
    );
}