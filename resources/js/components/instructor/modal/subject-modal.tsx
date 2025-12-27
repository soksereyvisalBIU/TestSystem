import { router, useForm } from '@inertiajs/react';
import { Loader2, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

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

interface SubjectModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    classId: number | string;
    editingSubject?: any;
}

export default function SubjectModal({
    isOpen,
    setIsOpen,
    classId,
    editingSubject,
}: SubjectModalProps) {
    const isEdit = useMemo(() => !!editingSubject?.id, [editingSubject]);
    const [preview, setPreview] = useState<string | null>(null);

    // Initialize useForm with empty values
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            description: '',
            visibility: 'public',
            cover: null as File | null,
        });

    // Sync form data when modal opens or editingSubject changes
    useEffect(() => {
        if (isOpen) {
            if (isEdit && editingSubject) {
                setData({
                    name: editingSubject.name || '',
                    description: editingSubject.description || '',
                    visibility: editingSubject.visibility || 'public',
                    cover: null, // Reset file input on edit
                });
                setPreview(
                    editingSubject.cover
                        ? `/storage/${editingSubject.cover}`
                        : null,
                );
            } else {
                reset();
                clearErrors();
                setPreview(null);
            }
        }
    }, [isOpen, editingSubject, isEdit]);

    const handleImage = (file: File | undefined) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Max image size is 2MB');
            return;
        }
        setPreview(URL.createObjectURL(file));
        setData('cover', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            // We use router.post instead of form.post to have total control over the data
            router.post(
                route('instructor.classes.subjects.update', [
                    classId,
                    editingSubject.id,
                ]),
                {
                    _method: 'put', // Explicitly add this at the top level
                    name: data.name,
                    description: data.description,
                    visibility: data.visibility,
                    cover: data.cover, // The File object
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        // toast.success('Subject updated successfully');
                        setIsOpen(false);
                    },
                },
            );
        } else {
            // Normal Create
            post(route('instructor.classes.subjects.store', classId), {
                forceFormData: true,
                onSuccess: () => {
                    // toast.success('Subject created successfully');
                    setIsOpen(false);
                },
            });
        }
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEdit ? 'Update Subject' : 'Create Subject'}
        >
            <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && (
                        <p className="text-xs text-destructive">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select
                        value={data.visibility}
                        onValueChange={(v: any) => setData('visibility', v)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="rounded-xl border-2 border-dashed p-4">
                        {preview ? (
                            <div className="relative h-40">
                                <img
                                    src={preview}
                                    className="h-full w-full rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                        setPreview(null);
                                        setData('cover', null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex cursor-pointer flex-col items-center gap-2 py-4">
                                <Upload className="h-5 w-5" />
                                <span className="text-xs">Upload Image</span>
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImage(e.target.files?.[0])
                                    }
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? 'Save Changes' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
