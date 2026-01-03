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
    onSave: (payload: any) => void;
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

    useEffect(() => {
        if (question) {
            setType(question.type || 'true_false');
            setData({
                ...question,
                media: question.media || [],
                max_file_size: question.max_file_size || 10,
                accepted_file_types: question.accepted_file_types || 'image',
                allow_file_upload: question.allow_file_upload ?? (question.type === 'fileupload'),
            });
        } else {
            setType('true_false');
            setData({ 
                point: 1,
                question: '',
                answer: '',
                media: [],
                max_file_size: 10,
                accepted_file_types: 'image',
                allow_file_upload: false
            }); 
        }
    }, [question, isOpen]);

    const handleSave = () => {
        let error = '';
        if (!data.question || data.question.trim() === '') {
            error = 'Question text is required.';
        } else {
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
                    } else if (data.answer === undefined || data.answer === null) {
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
                        error = 'At least 2 items are required to set an order.';
                    }
                    break;
                case 'fileupload':
                    if (!data.accepted_file_types) {
                        error = 'Please specify allowed file formats.';
                    }
                    break;
            }
        }

        if (error) {
            toast.error(error);
            return;
        }

        onSave({
            ...data,
            type,
            assessment_id: assessmentId,
            point: data.point || 1,
            allow_file_upload: type === 'fileupload',
        });

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
    }[type as keyof typeof TypeComponent];

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            size="lg"
            title={
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {question ? <Settings2 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none text-title">
                            {question ? 'Edit Question' : 'Create Question'}
                        </span>
                        <span className="text-[10px] text-description font-medium">
                            {question ? `ID: #${question.id}` : 'Drafting new assessment item'}
                        </span>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col space-y-6">
                {/* CONFIGURATION SECTION */}
                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/30 p-5 shadow-sm md:grid-cols-12">
                    <div className="space-y-2 md:col-span-8">
                        <Label className="ml-1 text-[11px] font-bold tracking-widest text-description uppercase">
                            Question Format
                        </Label>
                        {!question ? (
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-11 border-input bg-background text-body shadow-sm ring-offset-0 focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-popover shadow-xl">
                                    <SelectItem value="true_false">
                                        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-500" /> True / False</div>
                                    </SelectItem>
                                    <SelectItem value="fill_blank">
                                        <div className="flex items-center gap-2"><Type className="h-4 w-4 text-success" /> Fill in the Blank</div>
                                    </SelectItem>
                                    <SelectItem value="multiple_choice">
                                        <div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Multiple Choice</div>
                                    </SelectItem>
                                    <SelectItem value="matching">
                                        <div className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-orange-500" /> Matching</div>
                                    </SelectItem>
                                    <SelectItem value="short_answer">
                                        <div className="flex items-center gap-2"><AlignLeft className="h-4 w-4 text-subtitle" /> Short Answer</div>
                                    </SelectItem>
                                    <SelectItem value="fileupload">
                                        <div className="flex items-center gap-2"><File className="h-4 w-4 text-yellow-500" /> File Upload</div>
                                    </SelectItem>
                                    <SelectItem value="ordering">
                                        <div className="flex items-center gap-2"><ListOrdered className="h-4 w-4 text-success" /> Ordering</div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex h-11 items-center gap-3 rounded-lg border border-border bg-background px-4 font-semibold text-subtitle shadow-sm ring-1 ring-border/50">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-4">
                        <Label className="ml-1 text-[11px] font-bold tracking-widest text-description uppercase">
                            Points
                        </Label>
                        <div className="group relative">
                            <Trophy className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-description/50 transition-colors group-focus-within:text-primary" />
                            <Input
                                type="number"
                                min={0}
                                step={0.5}
                                className="h-11 border-input bg-background text-body pl-10 shadow-sm focus:ring-2 focus:ring-primary/20"
                                value={data.point || ''}
                                placeholder="1.0"
                                onChange={(e) => setData((prev: any) => ({ ...prev, point: parseFloat(e.target.value) }))}
                            />
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT SECTION */}
                <div className="relative min-h-[350px] rounded-2xl border border-border bg-card p-1 shadow-sm transition-all duration-300">
                    <div className="px-5 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1 rounded-full bg-primary" />
                            <h3 className="text-sm font-bold tracking-tight text-title uppercase">
                                Builder Tool
                            </h3>
                        </div>
                        {type === 'fileupload' && (
                             <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                                Reference Assets Supported
                             </span>
                        )}
                    </div>

                    <div className="p-5 animate-in duration-500 fade-in slide-in-from-bottom-3">
                        {TypeComponent ? (
                            <TypeComponent data={data} onChange={setData} />
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/10">
                                <p className="text-sm text-description font-medium">
                                    Select a question type to begin construction
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="flex items-center justify-between border-t border-border bg-muted/20 -mx-6 -mb-6 px-6 py-5 rounded-b-3xl">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="font-bold text-xs uppercase tracking-widest text-description hover:bg-background hover:text-destructive transition-all"
                    >
                        Discard Changes
                    </Button>

                    <Button
                        onClick={handleSave}
                        className="h-12 min-w-[160px] rounded-xl bg-primary font-bold text-xs uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {question ? 'Save Updates' : 'Publish Question'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}