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

interface ClassModalProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    mode: 'create' | 'edit';
    classData: any;
}

export default function ClassModal({
    isOpen,
    setIsOpen,
    mode,
    classData,
}: ClassModalProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, progress, errors, reset, put } = useForm({
        name: '',
        description: '',
        campus: '',
        major: '',
        batch: '',
        year: '',
        semester: '',
        shift: '',
        cover: null as File | null,
    });

    /** Prefill form when editing */
    useEffect(() => {
        if (mode === 'edit' && classData) {
            setData({
                name: classData.name,
                description: classData.description,
                campus: classData.campus,
                major: classData.major,
                batch: classData.batch,
                year: classData.year,
                semester: classData.semester,
                shift: classData.shift,
                cover: null,
            });
            setPreview(classData.cover_url);
        } else {
            reset();
            setPreview(null);
        }
    }, [mode, classData]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (mode === 'create') {
            post(route('instructor.classes.store'), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            put(route('instructor.classes.update', classData.id), {
                onSuccess: () => setIsOpen(false),
            });
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
            title={mode === 'create' ? 'Create Class' : 'Update Class'}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                    <Label>Name</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Class name"
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
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Short description"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Campus / Major / Batch */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Campus</Label>
                        <Select
                            onValueChange={(v) => setData('campus', v)}
                            defaultValue={data.campus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Campus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.campus && (
                            <p className="text-sm text-red-500">
                                {errors.campus}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Major</Label>
                        <Select
                            onValueChange={(v) => setData('major', v)}
                            defaultValue={data.major}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Major" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    'Software Engineering',
                                    'Computer Networking',
                                    'Multimedia Design',
                                ].map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.major && (
                            <p className="text-sm text-red-500">
                                {errors.major}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Batch</Label>
                        <Select
                            onValueChange={(v) => setData('batch', v)}
                            defaultValue={data.batch}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <SelectItem
                                        key={i + 1}
                                        value={String(i + 1)}
                                    >
                                        {i + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.batch && (
                            <p className="text-sm text-red-500">
                                {errors.batch}
                            </p>
                        )}
                    </div>
                </div>

                {/* Year / Semester / Shift */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Year</Label>
                        <Select
                            onValueChange={(v) => setData('year', v)}
                            defaultValue={data.year}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4].map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.year && (
                            <p className="text-sm text-red-500">
                                {errors.year}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Semester</Label>
                        <Select
                            onValueChange={(v) => setData('semester', v)}
                            defaultValue={data.semester}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.semester && (
                            <p className="text-sm text-red-500">
                                {errors.semester}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Shift</Label>
                        <Select
                            onValueChange={(v) => setData('shift', v)}
                            defaultValue={data.shift}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Shift" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Morning">Morning</SelectItem>
                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                <SelectItem value="Evening">Evening</SelectItem>
                                <SelectItem value="Weekend">Weekend</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.shift && (
                            <p className="text-sm text-red-500">
                                {errors.shift}
                            </p>
                        )}
                    </div>
                </div>

                {/* Image */}
                <div>
                    <Label>Class Cover</Label>
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
