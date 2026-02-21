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
import { Loader2, AlertCircle } from 'lucide-react';
import React, { useEffect, useMemo, useCallback } from 'react';
import { route } from 'ziggy-js';

interface AssessmentModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    classId: number;
    subjectId: number;
    assessment?: any;
}

export default function AssessmentModal({
    isOpen,
    setIsOpen,
    classId,
    subjectId,
    assessment,
}: AssessmentModalProps) {
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

    // Performance: Memoize the current local ISO string
    const minDateTime = useMemo(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const local = new Date(now.getTime() - offset * 60 * 1000);
        return local.toISOString().slice(0, 16);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setData({
                    title: assessment.title ?? '',
                    description: assessment.description ?? '',
                    type: assessment.type ?? '',
                    max_attempts: assessment.max_attempts?.toString() ?? '1',
                    start_time: assessment.start_time?.replace(' ', 'T').slice(0, 16) ?? '',
                    end_time: assessment.end_time?.replace(' ', 'T').slice(0, 16) ?? '',
                    duration: assessment.duration?.toString() ?? '',
                });
            } else {
                reset();
                clearErrors();
            }
        }
    }, [isOpen, assessment]);

    // Logic: Ensure End Time is at least "duration" minutes after Start Time
    const validateAndAdjustTimes = useCallback((startTime: string, endTime: string, durationStr: string) => {
        if (!startTime || !endTime || !durationStr) return { startTime, endTime };

        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMs = parseInt(durationStr) * 60 * 1000;

        // If the window is smaller than duration, push end time forward
        if (end.getTime() - start.getTime() < durationMs) {
            const newEnd = new Date(start.getTime() + durationMs);
            const offset = newEnd.getTimezoneOffset();
            const adjustedEnd = new Date(newEnd.getTime() - offset * 60 * 1000);
            return { startTime, endTime: adjustedEnd.toISOString().slice(0, 16) };
        }

        return { startTime, endTime };
    }, []);

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.value;
        if (selected < minDateTime && !isEditing) return;

        const { endTime } = validateAndAdjustTimes(selected, data.end_time, data.duration);
        setData(prev => ({ ...prev, start_time: selected, end_time: endTime }));
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.value;
        const { endTime } = validateAndAdjustTimes(data.start_time, selected, data.duration);
        setData('end_time', endTime);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const { endTime } = validateAndAdjustTimes(data.start_time, data.end_time, val);
        setData(prev => ({ ...prev, duration: val, end_time: endTime }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { onSuccess: () => { reset(); setIsOpen(false); } };

        if (isEditing) {
            put(route('instructor.classes.subjects.assessments.update', [classId, subjectId, assessment.id]), options);
        } else {
            post(route('instructor.classes.subjects.assessments.store', [classId, subjectId]), options);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEditing ? 'Edit Assessment' : 'Create New Assessment'}
        >
            <form className="space-y-5 py-2" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <Label htmlFor="title">Assessment Title</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.title && <p className="text-xs font-medium text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                    <Label>Instructions / Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Type</Label>
                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="exam">Exam</SelectItem>
                                <SelectItem value="homework">Homework</SelectItem>
                                <SelectItem value="midterm">Midterm</SelectItem>
                                <SelectItem value="final">Final Exam</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label>Max Attempts</Label>
                        <Input
                            type="number"
                            min="1"
                            max={10}
                            value={data.max_attempts}
                            onChange={(e) => setData('max_attempts', e.target.value)}
                        />
                    </div>
                </div>

                {/* Duration - Moved up for better UX flow since it affects Date logic */}
                <div className="space-y-1">
                    <Label>Duration (Minutes)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 60"
                        min={0}
                        max={320}
                        value={data.duration}
                        onChange={handleDurationChange}
                        className={errors.duration ? 'border-red-500' : ''}
                    />
                    <p className="text-[11px] font-medium text-slate-400">
                        The availability window (Start to End) must be at least as long as the duration.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label>Start Date & Time</Label>
                        <Input
                            type="datetime-local"
                            value={data.start_time}
                            min={minDateTime}
                            onChange={handleStartChange}
                            className={errors?.start_time ? 'border-red-500' : ''}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>End Date & Time</Label>
                        <Input
                            type="datetime-local"
                            value={data.end_time}
                            min={data.start_time || minDateTime}
                            onChange={handleEndChange}
                            className={errors?.end_time ? 'border-red-500' : ''}
                        />
                    </div>
                </div>

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
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : isEditing ? 'Save Changes' : 'Create Assessment'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}