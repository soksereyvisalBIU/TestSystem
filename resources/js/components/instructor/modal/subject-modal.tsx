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
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { route } from 'ziggy-js';

interface SubjectModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    mode: 'create' | 'edit';
    subjectData: any;
}

export default function SubjectModal({
    isOpen,
    setIsOpen,
    mode,
    classId,
    subjectData,
}: SubjectModalProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, put, errors, reset } = useForm({
        name: '',
        description: '',
        visibility: '',
        cover: null as File | null,
    });

    /** Prefill form when editing */
    useEffect(() => {
        if (mode === 'edit' && subjectData) {
            setData({
                name: subjectData.name,
                description: subjectData.description,
                visibility: subjectData.visibility,
                cover: null,
            });

            setPreview(subjectData.cover_url ?? null);
        } else {
            reset();
            setPreview(null);
        }
    }, [mode, subjectData]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('instructor.classes.subjects.store' , classId), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            put(
                route('instructor.classes.subjects.update', subjectData.id),
                {
                    onSuccess: () => setIsOpen(false),
                }
            );
        }
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={mode === 'create' ? 'Create Subject' : 'Update Subject'}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                    <Label>Name</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Enter subject name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                        placeholder="Short description"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Visibility */}
                <div>
                    <Label>Visibility</Label>
                    <Select
                        onValueChange={(v) => setData('visibility', v)}
                        defaultValue={data.visibility}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.visibility && (
                        <p className="text-sm text-red-500">
                            {errors.visibility}
                        </p>
                    )}
                </div>

                {/* Image */}
                <div>
                    <Label>Cover Image</Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    {errors.cover && (
                        <p className="text-sm text-red-500">{errors.cover}</p>
                    )}

                    {preview && (
                        <img
                            src={preview}
                            className="mt-2 h-32 w-full rounded border object-cover"
                        />
                    )}
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
                    <Button type="submit">
                        {mode === 'create' ? 'Create' : 'Update'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
