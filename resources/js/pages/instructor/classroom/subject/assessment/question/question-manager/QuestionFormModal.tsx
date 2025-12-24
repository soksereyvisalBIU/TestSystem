import {
    AlignLeft,
    CheckCircle2,
    File,
    HelpCircle,
    Layers,
    ListOrdered,
    PlusCircle,
    Save,
    Settings2,
    Trophy,
    Type,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

// Question Type Form Imports
import FileUploadForm from './questiontypes/FileUploadForm';
import FillBlankForm from './questiontypes/FillBlankForm';
import MatchingForm from './questiontypes/MatchingForm';
import MultipleChoiceForm from './questiontypes/MultipleChoiceForm';
import OrderingForm from './questiontypes/OrderingForm';
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

    // Sync state when editing or opening
    useEffect(() => {
        if (question) {
            setType(question.type || 'true_false');
            setData(question);
        } else {
            setType('true_false');
            setData({ point: 1 }); // Default points
        }
    }, [question, isOpen]);

    const handleSave = () => {
        let error = '';

        if (!data.question || data.question.trim() === '') {
            error = 'Question text is required.';
        } else {
            // Validation Logic
            switch (type) {
                case 'true_false':
                case 'fill_blank':
                case 'short_answer':
                    if (!data.answer || data.answer.toString().trim() === '') {
                        error = 'A valid answer is required.';
                    }
                    break;
                case 'multiple_choice':
                    if (!data.options || data.options.length < 2) {
                        error = 'At least 2 options are required.';
                    } else if (
                        data.answer === undefined ||
                        data.answer === null
                    ) {
                        error = 'Please select the correct answer.';
                    }
                    break;
                case 'matching':
                    if (!data.answer || data.answer.length === 0) {
                        error = 'At least 1 matching pair is required.';
                    }
                    break;
                case 'ordering':
                    if (!data.items || data.items.length < 2) {
                        error =
                            'At least 2 items are required to set an order.';
                    }
                    break;
            }
        }

        if (error) {
            toast.error(error);
            return;
        }

        const payload = {
            ...data,
            type,
            assessment_id: assessmentId,
            point: data.point || 1,
        };

        onSave(payload);

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
        ordering: OrderingForm,
        fileupload: FileUploadForm,
    }[type];

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            size="lg"
            title={
                <div className="flex items-center gap-2">
                    {question ? (
                        <Settings2 className="h-5 w-5 text-primary" />
                    ) : (
                        <PlusCircle className="h-5 w-5 text-primary" />
                    )}
                    <span>
                        {question ? 'Edit Question' : 'Create Question'}
                    </span>
                </div>
            }
        >
            <div className="flex flex-col space-y-6">
                {/* CONFIGURATION SECTION */}
                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm md:grid-cols-12">
                    <div className="space-y-2 md:col-span-8">
                        <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                            Question Format
                        </Label>
                        {!question ? (
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-11 border-slate-200 bg-white focus:ring-primary/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true_false">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-sky-500" />{' '}
                                            True / False
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="fill_blank">
                                        <div className="flex items-center gap-2">
                                            <Type className="h-4 w-4 text-emerald-500" />{' '}
                                            Fill in the Blank
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="multiple_choice">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-violet-500" />{' '}
                                            Multiple Choice
                                        </div>
                                    </SelectItem>

                                    <SelectItem value="matching">
                                        <div className="flex items-center gap-2">
                                            <HelpCircle className="h-4 w-4 text-orange-500" />{' '}
                                            Matching
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="short_answer">
                                        <div className="flex items-center gap-2">
                                            <AlignLeft className="h-4 w-4 text-slate-500" />{' '}
                                            Short Answer
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="fileupload">
                                        <div className="flex items-center gap-2">
                                            <File className="h-4 w-4 text-yellow-500" />{' '}
                                            File Upload
                                        </div>
                                    </SelectItem>
                                    {/* <SelectLabel>North America</SelectLabel> */}
                                    <SelectItem value="ordering">
                                        <div className="flex items-center gap-2">
                                            <ListOrdered className="h-4 w-4 text-emerald-500" />{' '}
                                            Ordering
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-white px-4 font-medium text-slate-700 shadow-sm">
                                {type
                                    .split('_')
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1),
                                    )
                                    .join(' ')}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-4">
                        <Label className="ml-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                            Points
                        </Label>
                        <div className="group relative">
                            <Trophy className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                            <Input
                                type="number"
                                min={0.5}
                                step={0.5}
                                className="h-11 border-slate-200 bg-white pl-10 focus:ring-primary/20"
                                value={data.point || ''}
                                placeholder="1.0"
                                onChange={(e) =>
                                    setData((prev: any) => ({
                                        ...prev,
                                        point: parseFloat(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT SECTION */}
                <div className="relative min-h-[300px] rounded-xl bg-white transition-all duration-300">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-6 w-1.5 rounded-full bg-primary" />
                        <h3 className="font-bold tracking-tight text-slate-800">
                            Question Builder
                        </h3>
                    </div>

                    <div className="animate-in duration-500 fade-in slide-in-from-bottom-3">
                        {TypeComponent ? (
                            <TypeComponent data={data} onChange={setData} />
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-100">
                                <p className="text-sm text-slate-400">
                                    Select a question type to begin
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    >
                        Discard Changes
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            className="h-11 min-w-[140px] rounded-lg bg-primary shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] hover:bg-primary/90 active:translate-y-[1px]"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {question ? 'Update Question' : 'Add to Quiz'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
