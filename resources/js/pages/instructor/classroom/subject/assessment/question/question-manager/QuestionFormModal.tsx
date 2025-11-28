// import Modal from '@/components/Modal/Modal';
import Modal from '@/components/instructor/modal/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import FillBlankForm from './questiontypes/FillBlankForm';
import MatchingForm from './questiontypes/MatchingForm';
import MultipleChoiceForm from './questiontypes/MultipleChoiceForm';
import ShortAnswerForm from './questiontypes/ShortAnswerForm';
import TrueFalseForm from './questiontypes/TrueFalseForm';

interface Props {
    assessmentId: number;
    question?: any;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    onClose: () => void;
    onSave: (question: any) => void;
}

export default function QuestionFormModal({
    assessmentId,
    question,
    isOpen,
    setIsOpen,
    onClose,
    onSave,
}: Props) {
    const [type, setType] = useState(question?.type || 'true_false');
    const [data, setData] = useState<any>(question || {});

    // ✅ Sync state when editing a new question
    useEffect(() => {
        if (question) {
            setType(question.type || 'true_false');
            setData(question);
        } else {
            setType('true_false');
            setData({});
        }
    }, [question, isOpen]); // reset every time modal opens or question changes

    const handleSave = () => {
        let error = '';

        if (!data.question || data.question.trim() === '') {
            error = 'Question cannot be empty.';
        } else {
            switch (type) {
                case 'true_false':
                case 'fill_blank':
                case 'short_answer':
                    if (!data.answer || data.answer.trim() === '') {
                        error = 'Answer cannot be empty.';
                    }
                    break;

                case 'multiple_choice':
                    if (!data.options || data.options.length < 2) {
                        error = 'At least 2 options are required.';
                    } else if (!data.answer) {
                        error = 'Please select a correct answer.';
                    } else if (
                        data.options.some((opt: string) => opt.trim() === '')
                    ) {
                        error = 'Option text cannot be empty.';
                    }
                    break;

                case 'matching':
                    if (!data.answer || data.answer.length === 0) {
                        error = 'At least 1 pair is required.';
                    } else if (
                        data.answer.some(
                            (pair: any) =>
                                !pair.left?.trim() || !pair.right?.trim(),
                        )
                    ) {
                        error =
                            'All matching pairs must have both left and right values.';
                    }
                    break;
            }
        }

        if (error) {
            toast.error(error);
            return;
        }

        // ✅ If editing, keep the same ID; if creating, mark as new
        const payload = {
            ...data,
            type,
            assessment_id: assessmentId,
            point: data.point || 1,
        };

        onSave(payload);

        // ✅ Reset only when creating
        if (!question) {
            setData({});
            setType('true_false');
        }

        onClose();
    };

    const TypeComponent = {
        true_false: TrueFalseForm,
        fill_blank: FillBlankForm,
        multiple_choice: MultipleChoiceForm,
        matching: MatchingForm,
        short_answer: ShortAnswerForm,
    }[type];

    if (!TypeComponent) return null;

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            size="xl"
            title={question ? 'Edit Question' : 'Create Question'}
        >
            <div>
                <Label>Question Type</Label>

                {/* Only allow type change when creating new */}
                {!question && (
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true_false">
                                True / False
                            </SelectItem>
                            <SelectItem value="fill_blank">
                                Fill in the Blank
                            </SelectItem>
                            <SelectItem value="multiple_choice">
                                Multiple Choice
                            </SelectItem>
                            <SelectItem value="matching">Matching</SelectItem>
                            <SelectItem value="short_answer">
                                Short Answer
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <div className="mt-4">
                    <TypeComponent data={data} onChange={setData} />
                </div>
                <div className="mt-4">
                    <Label>Point</Label>
                    <Input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={data.point || ''}
                        placeholder="1pt"
                        onChange={(e) =>
                            setData((prev: any) => ({
                                ...prev,
                                point: parseFloat(e.target.value),
                            }))
                        }
                    />
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        {question ? 'Save Changes' : 'Add Question'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
