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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { route } from 'ziggy-js';

interface AssessmentModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    // mode prop removed
    classId: number;
    subjectId: number;
    assessment?: any; // If this is present, we are in Edit mode. If null/undefined, Create mode.
}

export default function AssessmentModal({
    isOpen,
    setIsOpen,
    classId,
    subjectId,
    assessment,
}: AssessmentModalProps) {
    // Helper boolean to check if we are editing
    const isEditing = !!assessment;

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm({
            title: '',
            description: '',
            type: '',
            max_attempts: '1',
            start_time: '',
            end_time: '',
            duration: '',
        });

    // Synchronize form with assessment prop when editing or opening
    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setData({
                    title: assessment.title ?? '',
                    description: assessment.description ?? '',
                    type: assessment.type ?? '',
                    max_attempts: assessment.max_attempts?.toString() ?? '1',
                    start_time:
                        assessment.start_time?.replace(' ', 'T').slice(0, 16) ??
                        '',
                    end_time:
                        assessment.end_time?.replace(' ', 'T').slice(0, 16) ??
                        '',
                    duration: assessment.duration?.toString() ?? '',
                });
            } else {
                reset();
                clearErrors();
            }
        }
    }, [isOpen, assessment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        };

        if (isEditing) {
            // Update logic
            put(
                route('instructor.classes.subjects.assessments.update', [
                    classId,
                    subjectId,
                    assessment.id,
                ]),
                options,
            );
        } else {
            // Create logic
            post(
                route('instructor.classes.subjects.assessments.store', [
                    classId,
                    subjectId,
                ]),
                options,
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditing ? 'Edit Assessment' : 'Create New Assessment'}
        >
            <form className="space-y-5 py-2" onSubmit={handleSubmit}>
                {/* Title */}
                <div className="space-y-1">
                    <Label htmlFor="title">Assessment Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Midterm Physics Exam"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={
                            errors.title
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                        }
                    />
                    {errors.title && (
                        <p className="text-xs font-medium text-red-500">
                            {errors.title}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <Label>Instructions / Description</Label>
                    <Textarea
                        placeholder="Explain the rules or topics covered..."
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                    />
                </div>

                {/* Type & Max Attempts */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(v) => setData('type', v)}
                        >
                            <SelectTrigger
                                className={errors.type ? 'border-red-500' : ''}
                            >
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="exam">Exam</SelectItem>
                                <SelectItem value="homework">
                                    Homework
                                </SelectItem>
                                <SelectItem value="midterm">Midterm</SelectItem>
                                <SelectItem value="final">
                                    Final Exam
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-xs font-medium text-red-500">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Max Attempts</Label>
                        <Input
                            type="number"
                            min="1"
                            value={data.max_attempts}
                            onChange={(e) =>
                                setData('max_attempts', e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Start Date & Time</Label>
                        <Input
                            type="datetime-local"
                            value={data.start_time}
                            onChange={(e) =>
                                setData('start_time', e.target.value)
                            }
                            className={
                                errors.start_time ? 'border-red-500' : ''
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>end_time (End Time)</Label>
                        <Input
                            type="datetime-local"
                            value={data.end_time}
                            onChange={(e) =>
                                setData('end_time', e.target.value)
                            }
                            className={errors.end_time ? 'border-red-500' : ''}
                        />
                    </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                    <Label>Duration (Minutes)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 60"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        className={errors.duration ? 'border-red-500' : ''}
                    />
                    <p className="text-[11px] font-medium text-slate-400">
                        Set to 0 or leave empty for no time limit.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="font-semibold text-slate-500 hover:text-slate-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 px-8 font-bold text-white hover:bg-blue-700"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : isEditing ? (
                            'Save Changes'
                        ) : (
                            'Create Assessment'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
