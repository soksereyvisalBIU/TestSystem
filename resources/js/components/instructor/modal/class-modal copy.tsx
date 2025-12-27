import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    ImageIcon,
    Loader2,
    Upload,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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
import { cn } from '@/lib/utils';
import Modal from './Modal';
import { route } from 'ziggy-js';

// --- Improved Helper Components ---

const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence mode="wait">
        {message && (
            <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex items-center gap-1.5 pt-1"
            >
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[11px] font-bold tracking-tight text-destructive uppercase">
                    {message}
                </span>
            </motion.div>
        )}
    </AnimatePresence>
);

const StyledLabel = ({ children, error, required }: any) => (
    <Label
        className={cn(
            'mb-1.5 block text-[11px] font-black tracking-widest text-slate-500 uppercase transition-colors dark:text-slate-400',
            error && 'text-destructive',
        )}
    >
        {children} {required && <span className="text-destructive">*</span>}
    </Label>
);

export default function ClassModal({
    isOpen,
    setIsOpen,
    classData,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    classData?: any;
}) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // 1. Local Form State
    const [formData, setFormData] = useState({
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

    const isEdit = useMemo(() => !!classData?.id, [classData]);

    // 2. TanStack Mutation Setup
    const { mutate, isPending, error: mutationError, reset: resetMutation } = useMutation({
        mutationFn: async (vars: { id?: number; payload: FormData }) => {
            const url = vars.id 
                ? route('instructor.classes.update', vars.id) 
                : route('instructor.classes.store');
            
            // Note: We use axios.post even for updates because of Laravel's 
            // multipart/form-data limitations with PUT
            const response = await axios.post(url, vars.payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate the list query to trigger a refresh
            queryClient.invalidateQueries({ queryKey: ['instructor-classes'] });
            
            toast.success(`Success! Class has been ${isEdit ? 'updated' : 'created'}.`, {
                icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
            });
            setIsOpen(false);
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    });

    // Extract validation errors from Axios response
    const errors = (mutationError as any)?.response?.data?.errors || {};

    // 3. Sync state when modal opens or classData changes
    useEffect(() => {
        if (isOpen) {
            resetMutation();
            if (isEdit && classData) {
                setFormData({
                    name: classData.name ?? '',
                    description: classData.description ?? '',
                    campus: String(classData.campus ?? ''),
                    major: classData.major ?? '',
                    batch: String(classData.batch ?? ''),
                    year: String(classData.year ?? ''),
                    semester: String(classData.semester ?? ''),
                    shift: classData.shift ?? '',
                    cover: null,
                });
                setPreview(classData.cover_url ?? null);
            } else {
                setFormData({
                    name: '', description: '', campus: '', major: '', 
                    batch: '', year: '', semester: '', shift: '', cover: null 
                });
                setPreview(null);
            }
        }
    }, [isOpen, isEdit, classData, resetMutation]);

    const handleFile = (file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image too large. Max 2MB.');
            return;
        }
        setFormData(prev => ({ ...prev, cover: file }));
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = new FormData();
        // Append all text fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                payload.append(key, value as string | Blob);
            }
        });

        // Crucial: Spoof PUT for Laravel if editing
        if (isEdit) {
            payload.append('_method', 'PUT');
        }

        mutate({ id: classData?.id, payload });
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Modal
            size="md"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isEdit ? 'Edit Class' : 'New Class'}
            className="rounded-l-[2rem] rounded-r-none"
        >
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {/* 1. Image Upload */}
                <div className="space-y-3">
                    <StyledLabel error={errors.cover}>Cover Image</StyledLabel>
                    <motion.div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            'group relative h-36 w-full cursor-pointer overflow-hidden rounded-[1.5rem] border-2 border-dashed transition-all duration-300',
                            isDragging ? 'scale-[0.98] border-primary bg-primary/5' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50',
                            errors.cover && 'border-destructive/50 bg-destructive/5',
                        )}
                    >
                        {preview ? (
                            <div className="relative h-full w-full">
                                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-black">
                                        <Upload className="h-3.5 w-3.5" /> Replace Photo
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-xl"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreview(null);
                                        updateField('cover', null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-3">
                                <div className="rounded-2xl bg-white p-2 shadow-sm transition-colors group-hover:text-primary dark:bg-slate-800">
                                    <ImageIcon className="h-8 w-8 text-slate-400 transition-colors group-hover:text-primary" />
                                </div>
                                <div className="px-4 text-center">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drop your image here</p>
                                    <p className="text-xs text-slate-400">or click to browse (Max 2MB)</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                    <ErrorMessage message={errors.cover?.[0]} />
                </div>

                {/* 2. Content */}
                <div className="grid gap-6">
                    <div className="space-y-1.5">
                        <StyledLabel required error={errors.name}>Class Title</StyledLabel>
                        <Input
                            placeholder="e.g. Design Systems 101"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="h-12 rounded-xl border-none bg-slate-50 font-medium ring-1 ring-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 dark:ring-slate-800"
                        />
                        <ErrorMessage message={errors.name?.[0]} />
                    </div>

                    <div className="space-y-1.5">
                        <StyledLabel error={errors.description}>About this class</StyledLabel>
                        <Textarea
                            placeholder="Provide a brief syllabus overview..."
                            value={formData.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            className="min-h-[120px] resize-none rounded-xl border-none bg-slate-50 p-4 ring-1 ring-slate-200 transition-all focus-visible:ring-2 focus-visible:ring-primary dark:bg-slate-900 dark:ring-slate-800"
                        />
                        <ErrorMessage message={errors.description?.[0]} />
                    </div>

                    {/* 3. Categorization */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <StyledLabel error={errors.campus}>Campus</StyledLabel>
                            <Select value={formData.campus} onValueChange={(v) => updateField('campus', v)}>
                                <SelectTrigger className="h-11 rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                                    <SelectValue placeholder="Select Campus" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="1">Main Campus</SelectItem>
                                    <SelectItem value="2">City Branch</SelectItem>
                                </SelectContent>
                            </Select>
                            <ErrorMessage message={errors.campus?.[0]} />
                        </div>

                        <div className="space-y-1.5">
                            <StyledLabel error={errors.major}>Major</StyledLabel>
                            <Select value={formData.major} onValueChange={(v) => updateField('major', v)}>
                                <SelectTrigger className="h-11 rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                                    <SelectValue placeholder="Select Major" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                            {/* $majorMap = [
                                                "Software Engineering" => 1,
                                                "Computer Networking"  => 2,
                                                "Multimedia Design"    => 3,
                                            ]; */}
                                    {['Software Engineering', 'Computer Networking', 'Multimedia Design'].map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <ErrorMessage message={errors.major?.[0]} />
                        </div>
                    </div>

                    {/* 4. Metadata */}
                    <div className="grid grid-cols-4 gap-4 rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800">
                        <div className="col-span-1">
                            <StyledLabel error={errors.batch}>Batch</StyledLabel>
                            <Input
                                type="number"
                                value={formData.batch}
                                onChange={(e) => updateField('batch', e.target.value)}
                                className="h-10 rounded-lg"
                            />
                        </div>
                        <div className="col-span-1">
                            <StyledLabel error={errors.year}>Year</StyledLabel>
                            <Select value={formData.year} onValueChange={(v) => updateField('year', v)}>
                                <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Y" /></SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {[1, 2, 3, 4].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1">
                            <StyledLabel error={errors.semester}>Sem.</StyledLabel>
                            <Select value={formData.semester} onValueChange={(v) => updateField('semester', v)}>
                                <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="S" /></SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="1">S1</SelectItem>
                                    <SelectItem value="2">S2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1">
                            <StyledLabel error={errors.shift}>Shift</StyledLabel>
                            <Select value={formData.shift} onValueChange={(v) => updateField('shift', v)}>
                                <SelectTrigger className="h-10 rounded-lg capitalize"><SelectValue placeholder="Shift" /></SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {/* $shiftMap = [
                                        "Morning"   => 1,
                                        "Afternoon" => 2,
                                        "Evening"   => 3,
                                        "Weekend"   => 4,
                                    ]; */}
                                    {['Morning', 'Afternoon', 'Evening', 'Weekend'].map((s) => (
                                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="rounded-xl font-bold text-slate-500"
                    >
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl bg-primary font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isEdit ? 'Update Details' : 'Launch Class'}
                    </Button>
                </div>
            </form>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
        </Modal>
    );
}