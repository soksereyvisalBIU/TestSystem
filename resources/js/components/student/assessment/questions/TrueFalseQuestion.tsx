import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from 'lucide-react'; // Icons for visual appeal

export default function TrueFalseQuestion({ question, answer, onChange }) {
    // Determine the color/icon based on the option text (assuming options are "True" and "False")
    const getOptionVisuals = (optionText) => {
        if (optionText.toLowerCase() === "true") {
            return {
                icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
                labelClass: "text-green-700 hover:bg-green-50 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-100",
            };
        }
        if (optionText.toLowerCase() === "false") {
            return {
                icon: <XCircle className="w-5 h-5 text-red-500" />,
                labelClass: "text-red-700 hover:bg-red-50 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-100",
            };
        }
        return {
            icon: null,
            labelClass: "text-gray-700 hover:bg-gray-50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50",
        };
    };

    return (
        <div className="w-full p-4 border rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
            {/* Question Text with improved emphasis */}
            <p className="font-semibold text-lg text-gray-900 mb-4 leading-relaxed">
                {question.text}
            </p>

            {/* Radio Group with enhanced layout and spacing */}
            <RadioGroup
                onValueChange={(val) => onChange(question.id, val)}
                value={answer || ""}
                className="grid grid-cols-2 gap-4"
            >
                {question.options.map((opt) => {
                    const { icon, labelClass } = getOptionVisuals(opt.text);
                    const isChecked = answer === opt.text;

                    return (
                        <Label
                            key={opt.id}
                            htmlFor={`${question.id}-${opt.id}`}
                            className={`
                                flex flex-col items-center justify-center space-y-2 
                                border-2 rounded-lg py-5 px-4 cursor-pointer 
                                text-base font-medium 
                                bg-white 
                                transition-all duration-200 ease-in-out
                                shadow-sm
                                ${labelClass}
                                ${isChecked ? 'ring-4 ring-offset-2 ring-opacity-50' : 'border-gray-300 hover:border-gray-400'}
                            `}
                            // Custom Tailwind State for visual indicator
                            data-state={isChecked ? "checked" : "unchecked"}
                        >
                            <RadioGroupItem
                                id={`${question.id}-${opt.id}`}
                                value={opt.text}
                                // Hide default radio button visually, as the whole card acts as the selector
                                className="sr-only" 
                            />
                            
                            {/* Icon for True/False */}
                            {icon}
                            
                            {/* Option Text */}
                            <span className="mt-1">{opt.text}</span>
                        </Label>
                    );
                })}
            </RadioGroup>
        </div>
    );
}