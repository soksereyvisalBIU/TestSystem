// components/Modal/ClassModal/SubjectModal.tsx

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
import Modal from './Modal';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface SubjectModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;

    // CREATE or EDIT mode
    method: 'create' | 'edit';

    // Prefilled form values (EDIT MODE)
    defaultValues?: {
        id?: number;
        name?: string;
        description?: string;
        visibility?: string;
    };

    // class id -> needed for store() route
    classId: number;
}

export default function SubjectModal({
    isOpen,
    setIsOpen,
    method,
    defaultValues,
    classId,
}: SubjectModalProps) {
    const { data, setData, post, put, processing, reset } = useForm({
        name: defaultValues?.name || '',
        description: defaultValues?.description || '',
        visibility: defaultValues?.visibility || '',
        cover: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (method === 'create') {
            post(route('instructor.classes.subjects.store', classId), {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            });
        } else {
            put(
                route('instructor.classes.subjects.update', {
                    class: classId,
                    subject: defaultValues?.id,
                }),
                {
                    onSuccess: () => {
                        reset();
                        setIsOpen(false);
                    },
                },
            );
        }
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={method === 'create' ? 'Create Subject' : 'Edit Subject'}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Subject Name */}
                <div>
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter subject name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Enter a short description"
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                    />
                </div>

                {/* Visibility */}
                <div>
                    <Label>Visibility</Label>
                    <Select
                        value={data.visibility}
                        onValueChange={(v) => setData('visibility', v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Cover Upload */}
                <div>
                    <Label>Cover Image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData('cover', e.target.files?.[0] ?? null)
                        }
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {method === 'create' ? 'Create' : 'Update'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
