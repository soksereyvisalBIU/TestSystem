import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion'; // Highly recommended for "Best" UX
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    File as FileIcon,
    HardDrive,
    ImageIcon,
    Loader2,
    Maximize2,
    Upload,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_URL = '/storage/';

export default function FileUploadQuestion({ question, answer, onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeMediaIndex, setActiveMediaIndex] = useState(null);
    const [isUploading, setIsUploading] = useState(false); // New: UX feedback
    const fileInputRef = useRef(null);

    const MAX_SIZE_MB = question.max_file_size || 10;
    const ACCEPTED_TYPE = question.accepted_file_types || 'any';
    const mediaItems = question.media || [];

    // Format file size for display
    const formatSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = 1;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    };

    useEffect(() => {
        const isFileObject = (obj) =>
            obj && typeof obj === 'object' && 'name' in obj;
        if (isFileObject(answer) && answer.type?.startsWith('image/')) {
            const url = URL.createObjectURL(answer);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl(null);
    }, [answer]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeMediaIndex === null) return;
            if (e.key === 'ArrowRight') handleNextMedia();
            if (e.key === 'ArrowLeft') handlePrevMedia();
            if (e.key === 'Escape') setActiveMediaIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeMediaIndex]);

    const handleNextMedia = () =>
        setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
    const handlePrevMedia = () =>
        setActiveMediaIndex(
            (prev) => (prev - 1 + mediaItems.length) % mediaItems.length,
        );

    const validateAndUpload = useCallback(
        (file) => {
            if (!file) return;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                alert(`File too large. Max limit is ${MAX_SIZE_MB}MB.`);
                return;
            }

            // Simulate upload "feel" for better UX
            setIsUploading(true);
            setTimeout(() => {
                setIsUploading(false);
                onChange(question.id, file);
            }, 800);
        },
        [MAX_SIZE_MB, question.id, onChange],
    );

    return (
        <div className="group w-full rounded-3xl border border-border bg-gradient-to-b from-card to-background p-5 shadow-xl transition-all duration-500 hover:shadow-2xl sm:p-8">
            {/* Header: Enhanced Typography & Spacing */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HardDrive className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                            Question Points
                        </p>
                        <p className="text-sm font-black text-primary">
                            {question.point} PTS
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                        Requirements
                    </p>
                    <p className="text-xs font-semibold">
                        {ACCEPTED_TYPE} • {MAX_SIZE_MB}MB Max
                    </p>
                </div>
            </div>

            {/* Reference Gallery: Modernized Cards */}
            {mediaItems.length > 0 && (
                <div className="mb-8 rounded-2xl bg-muted/30 p-4">
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        <ImageIcon className="h-4 w-4" /> Reference Material
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {mediaItems.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveMediaIndex(index)}
                                className="group/item relative h-24 w-24 overflow-hidden rounded-xl border-2 border-transparent bg-background ring-offset-2 transition-all hover:scale-105 hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <img
                                    src={`${STORAGE_URL}${item.path}`}
                                    alt="Reference"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover/item:opacity-100">
                                    <Maximize2 className="h-6 w-6 text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Area: State-Driven Design */}
            <div
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0])
                        validateAndUpload(e.dataTransfer.files[0]);
                }}
                onClick={() =>
                    !answer && !isUploading && fileInputRef.current?.click()
                }
                className={`relative flex min-h-[180px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'scale-[1.01] border-primary bg-primary/5' : 'border-border bg-muted/20'} ${answer ? 'border-emerald-500/50 bg-emerald-500/5' : 'cursor-pointer hover:border-primary/50'}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                        e.target.files?.[0] &&
                        validateAndUpload(e.target.files[0])
                    }
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {isUploading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm font-bold text-muted-foreground">
                                Uploading your file...
                            </p>
                        </motion.div>
                    ) : !answer ? (
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-6 text-center"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 transform items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                                <Upload className="h-7 w-7" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground">
                                Click or drag to upload
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                High resolution images or documents preferred
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex w-full flex-col items-center gap-5 p-6 sm:flex-row"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-card shadow-inner dark:border-muted">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 rounded-bl-lg bg-emerald-500 p-1">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 text-center sm:text-left">
                                <p className="mb-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                                    Upload Successful
                                </p>
                                <h4 className="truncate text-base font-bold text-foreground">
                                    {answer.name}
                                </h4>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {formatSize(answer.size)}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(question.id, null);
                                }}
                                className="rounded-xl border-destructive/20 transition-colors hover:bg-destructive hover:text-white"
                            >
                                <X className="mr-2 h-4 w-4" /> Change File
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Lightbox: Framer Motion Enhanced */}
            <AnimatePresence>
                {activeMediaIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
                    >
                        <button
                            onClick={() => setActiveMediaIndex(null)}
                            className="absolute top-8 right-8 z-[110] rounded-full bg-muted p-3 text-foreground shadow-xl transition-all hover:bg-primary hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="relative flex h-[70vh] w-full max-w-5xl items-center justify-center">
                            <button
                                onClick={handlePrevMedia}
                                className="absolute -left-4 z-10 rounded-full bg-card/80 p-4 text-foreground shadow-2xl transition-all hover:bg-primary hover:text-white sm:left-0"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>

                            <motion.img
                                key={activeMediaIndex}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                src={`${STORAGE_URL}${mediaItems[activeMediaIndex].path}`}
                                className="h-full w-full rounded-2xl object-contain drop-shadow-2xl"
                            />

                            <button
                                onClick={handleNextMedia}
                                className="absolute -right-4 z-10 rounded-full bg-card/80 p-4 text-foreground shadow-2xl transition-all hover:bg-primary hover:text-white sm:right-0"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="mt-8 flex max-w-full gap-2 overflow-x-auto pb-4">
                            {mediaItems.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMediaIndex(i)}
                                    className={`h-16 w-16 shrink-0 rounded-lg border-2 transition-all ${i === activeMediaIndex ? 'scale-110 border-primary shadow-lg' : 'border-transparent opacity-50'}`}
                                >
                                    <img
                                        src={`${STORAGE_URL}${item.path}`}
                                        className="h-full w-full rounded-md object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
