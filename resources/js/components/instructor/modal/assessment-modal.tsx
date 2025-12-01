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
import { route } from 'ziggy-js';

interface AssessmentModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    mode: 'create' | 'edit';
    classId: number;
    subjectId: number;
    assessment?: any; // only passed on edit
}

export default function AssessmentModal({
    isOpen,
    setIsOpen,
    mode,
    classId,
    subjectId,
    assessment,
}: AssessmentModalProps) {
    // Inertia form setup
    const { data, setData, post, put, processing, reset } = useForm({
        title: assessment?.title ?? '',
        description: assessment?.description ?? '',
        type: assessment?.type ?? '',
        max_attempts: assessment?.max_attempts ?? '',
        start_time: assessment?.start_time ?? '',
        deadline: assessment?.deadline ?? '',
        duration: assessment?.duration ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'create') {
            post(
                route('instructor.classes.subjects.assessments.store', {
                    class: classId,
                    subject: subjectId,
                    // assessment: assessment.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        setIsOpen(false);
                    },
                },
            );
        } else {
            put(
                route('instructor.classes.subjects.assessments.update', [
                    classId,
                    subjectId,
                    assessment.id,
                ]),
                {
                    onSuccess: () => {
                        setIsOpen(false);
                    },
                },
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={
                mode === 'create' ? 'Create Assessment' : 'Update Assessment'
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="Enter title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Enter description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(v) => setData('type', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quiz">Quiz</SelectItem>
                                <SelectItem value="exam">Exam</SelectItem>
                                <SelectItem value="homework">
                                    Homework
                                </SelectItem>
                                <SelectItem value="midterm">Midterm</SelectItem>
                                <SelectItem value="final">Final</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Max Attempts</Label>
                        <Input
                            type="number"
                            placeholder="1"
                            value={data.max_attempts}
                            onChange={(e) =>
                                setData('max_attempts', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Start Time</Label>
                        <Input
                            type="datetime-local"
                            value={data.start_time}
                            onChange={(e) =>
                                setData('start_time', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <Label>Deadline</Label>
                        <Input
                            type="datetime-local"
                            value={data.deadline}
                            onChange={(e) =>
                                setData('deadline', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                        type="number"
                        placeholder="30"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {mode === 'create' ? 'Submit' : 'Update'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
