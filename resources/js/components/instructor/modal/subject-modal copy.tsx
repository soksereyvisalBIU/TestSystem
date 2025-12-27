import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
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
    const queryClient = useQueryClient();
    const isEdit = useMemo(() => !!editingSubject?.id, [editingSubject]);
    const [preview, setPreview] = useState<string | null>(null);

    /* ------------------------------------------------------------------
     * CREATE (STORE) → Inertia useForm
     * ------------------------------------------------------------------ */
    const createForm = useForm({
        name: '',
        description: '',
        visibility: 'public',
        cover: null as File | null,
    });

    /* ------------------------------------------------------------------
     * EDIT (UPDATE) → TanStack Query
     * ------------------------------------------------------------------ */
    const {
        mutate: updateSubject,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useMutation({
        mutationFn: async (payload: FormData) => {
            return axios.post(
                route('instructor.classes.subjects.update', [
                    classId,
                    editingSubject.id,
                ]),
                payload,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        },
        onSuccess: () => {
            router.reload({
                only: ['classroom'],
                preserveScroll: true,
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ['subjects', classId],
                    });
                    toast.success('Subject updated successfully');
                    setIsOpen(false);
                },
            });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        },
    });

    /* ------------------------------------------------------------------
     * Sync form when modal opens
     * ------------------------------------------------------------------ */
    useEffect(() => {
        if (!isOpen) return;

        resetUpdate();

        if (isEdit) {
            setPreview(editingSubject?.cover_url ?? null);
        } else {
            createForm.reset();
            setPreview(null);
        }
    }, [isOpen, isEdit]);

    /* ------------------------------------------------------------------
     * Image handler (shared)
     * ------------------------------------------------------------------ */
    const handleImage = (file: File | undefined) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Max image size is 2MB');
            return;
        }

        setPreview(URL.createObjectURL(file));

        if (isEdit) {
            editingSubject.cover = file;
        } else {
            createForm.setData('cover', file);
        }
    };

    /* ------------------------------------------------------------------
     * Submit handler
     * ------------------------------------------------------------------ */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEdit) {
            /* CREATE */
            createForm.post(
                route('instructor.classes.subjects.store', classId),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        toast.success('Subject created successfully');
                        setIsOpen(false);
                    },
                }
            );
            return;
        }

        /* UPDATE */
        const data = new FormData();
        data.append('name', editingSubject.name);
        data.append('description', editingSubject.description ?? '');
        data.append('visibility', editingSubject.visibility);
        if (editingSubject.cover) data.append('cover', editingSubject.cover);
        data.append('_method', 'PUT');

        updateSubject(data);
    };

    const serverErrors =
        !isEdit
            ? createForm.errors
            : (updateError as any)?.response?.data?.errors || {};

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEdit ? 'Update Subject' : 'Create Subject'}
        >
            <form className="space-y-6 pt-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="space-y-2">
                    <Label>Subject Name</Label>
                    <Input
                        value={
                            isEdit ? editingSubject.name : createForm.data.name
                        }
                        onChange={(e) =>
                            isEdit
                                ? (editingSubject.name = e.target.value)
                                : createForm.setData('name', e.target.value)
                        }
                    />
                    {serverErrors.name && (
                        <p className="text-xs text-destructive">
                            {serverErrors.name[0]}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={
                            isEdit
                                ? editingSubject.description
                                : createForm.data.description
                        }
                        onChange={(e) =>
                            isEdit
                                ? (editingSubject.description =
                                      e.target.value)
                                : createForm.setData(
                                      'description',
                                      e.target.value
                                  )
                        }
                    />
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Select
                        value={
                            isEdit
                                ? editingSubject.visibility
                                : createForm.data.visibility
                        }
                        onValueChange={(v) =>
                            isEdit
                                ? (editingSubject.visibility = v)
                                : createForm.setData('visibility', v)
                        }
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

                {/* Cover */}
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
                                    className="absolute right-2 top-2"
                                    onClick={() => {
                                        setPreview(null);
                                        if (!isEdit)
                                            createForm.setData('cover', null);
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

                {/* Actions */}
                <div className="flex justify-end gap-3 border-t pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createForm.processing || isUpdating}
                    >
                        {(createForm.processing || isUpdating) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEdit ? 'Save Changes' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
