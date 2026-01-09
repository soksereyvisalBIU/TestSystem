import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Clock,
    Copy,
    Download,
    ExternalLink,
    Eye,
    FileIcon,
    FileText,
    Maximize2,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const STORAGE_URL = '/storage/';

export default function FileQuestion({ question, answers, onTeacherScore }) {
    const ans = answers[0] || {};
    // Extracting from answer_files array based on your console log
    const fileData = ans.answer_files?.[0] || {};
    const fileUrl = fileData.file_path
        ? `${STORAGE_URL}${fileData.file_path}`
        : null;
    const fileName = fileData.file_name || 'submitted_file';

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [tempScore, setTempScore] = useState(
        ans.manual_score ?? ans.points_earned ?? 0,
    );

    const { extension, isImage } = useMemo(() => {
        const ext = (fileData.file_path || '').split('.').pop().toLowerCase();
        return {
            extension: ext,
            isImage: ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext),
        };
    }, [fileData.file_path]);

    return (
        <div className="space-y-6">
            {/* 1. Main File Display */}
            {!fileUrl ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground/20" />
                    <p className="text-sm font-medium text-muted-foreground">
                        No file submitted.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                        {/* Interactive Thumbnail */}
                        <div
                            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden bg-muted sm:w-48"
                            onClick={() => isImage && setIsLightboxOpen(true)}
                        >
                            {isImage ? (
                                <>
                                    <img
                                        src={fileUrl}
                                        alt="Preview"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Maximize2 className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-2">
                                    <FileIcon className="h-10 w-10 text-primary/40" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase">
                                        {extension}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    <Clock className="h-3 w-3" />{' '}
                                    {new Date(
                                        fileData.created_at || ans.created_at,
                                    ).toLocaleDateString()}
                                </div>
                                <h4 className="mb-4 line-clamp-1 text-lg font-bold text-foreground">
                                    {fileName}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsLightboxOpen(true)}
                                        className="rounded-xl"
                                    >
                                        <Eye className="mr-2 h-3.5 w-3.5" />{' '}
                                        View {isImage ? 'Lightbox' : 'Details'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="rounded-xl"
                                    >
                                        <a href={fileUrl} download>
                                            <Download className="mr-2 h-3.5 w-3.5" />{' '}
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Grading Slider (Standard) */}
            {onTeacherScore && fileUrl && (
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm md:grid-cols-12">
                    {/* Visual Status & Direct Input Panel (4 cols) */}
                    <div className="col-span-1 flex flex-col items-center justify-center bg-primary p-6 text-primary-foreground md:col-span-4">
                        <div className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">
                            Points Earned
                        </div>

                        <div className="relative my-2 flex items-baseline">
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                max={question.point}
                                value={tempScore}
                                onChange={(e) => {
                                    const val = Math.min(
                                        question.point,
                                        Math.max(
                                            0,
                                            parseFloat(e.target.value) || 0,
                                        ),
                                    );
                                    setTempScore(val);
                                    onTeacherScore(question.id, val);
                                }}
                                className="w-24 bg-transparent text-center font-mono text-5xl font-black transition-transform outline-none focus:scale-110"
                            />
                            <span className="text-xl font-bold opacity-40">
                                / {question.point}
                            </span>
                        </div>

                        <div className="h-1 w-12 rounded-full bg-primary-foreground/20" />
                        <p className="mt-2 text-[10px] font-medium italic opacity-60">
                            Click number to type
                        </p>
                    </div>

                    {/* Control Panel (8 cols) */}
                    <div className="col-span-1 flex flex-col justify-center gap-6 p-6 md:col-span-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <h4 className="text-xs font-black tracking-wider text-foreground uppercase">
                                    Scoring Slider
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                    Drag to adjust or use presets below
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setTempScore(0);
                                    onTeacherScore(question.id, 0);
                                }}
                                className="rounded-md px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Slider with Dynamic Gradient */}
                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max={question.point}
                                step="0.5"
                                value={tempScore}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setTempScore(val);
                                    onTeacherScore(question.id, val);
                                }}
                                style={{
                                    background: `linear-gradient(to right, hsl(var(--primary)) ${(tempScore / question.point) * 100}%, hsl(var(--primary) / 0.1) ${(tempScore / question.point) * 100}%)`,
                                }}
                                className="h-2.5 w-full cursor-pointer appearance-none rounded-full accent-primary transition-all"
                            />
                        </div>

                        {/* Quick Action Bar */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => {
                                        const val = Math.max(
                                            0,
                                            tempScore - 0.5,
                                        );
                                        setTempScore(val);
                                        onTeacherScore(question.id, val);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-background text-lg font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-white active:scale-90"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        const val = Math.min(
                                            question.point,
                                            tempScore + 0.5,
                                        );
                                        setTempScore(val);
                                        onTeacherScore(question.id, val);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/10 bg-background text-lg font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-white active:scale-90"
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex flex-1 items-center justify-end gap-2">
                                {[0.5, 1].map((percent) => (
                                    <button
                                        key={percent}
                                        onClick={() => {
                                            const val =
                                                question.point * percent;
                                            setTempScore(val);
                                            onTeacherScore(question.id, val);
                                        }}
                                        className="rounded-xl border border-primary/10 bg-muted/30 px-4 py-2 text-[10px] font-black tracking-tight text-muted-foreground uppercase transition-all hover:bg-primary hover:text-primary-foreground"
                                    >
                                        {percent === 1 ? 'Full Mark' : '50%'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Framer Motion Lightbox Popup */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />

                        {/* Content Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl md:flex-row"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="absolute top-4 right-4 z-20 rounded-full bg-black/20 p-2 text-white transition-colors hover:bg-black/40 md:text-foreground md:hover:bg-muted"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Image Section */}
                            <div className="flex flex-[2] items-center justify-center bg-zinc-950 p-4">
                                {isImage ? (
                                    <img
                                        src={fileUrl}
                                        alt="Full view"
                                        className="max-h-full max-w-full object-contain shadow-2xl"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-white">
                                        <FileIcon className="h-24 w-24 opacity-20" />
                                        <p className="text-sm font-medium">
                                            Preview not available for{' '}
                                            {extension} files
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Info Sidebar (Desktop only or scrollable) */}
                            <div className="flex flex-1 flex-col justify-between border-l border-border bg-card p-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black tracking-tight text-foreground">
                                            {fileName}
                                        </h3>
                                        <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                            {extension} Document •{' '}
                                            {(
                                                fileData.file_size / 1024
                                            ).toFixed(1)}{' '}
                                            KB
                                        </p>
                                    </div>

                                    <hr className="border-border" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                                Status
                                            </p>
                                            <p className="text-sm font-semibold text-green-600 uppercase">
                                                Submitted
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                                                Current Score
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {tempScore} / {question.point}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        asChild
                                        className="w-full rounded-xl"
                                    >
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />{' '}
                                            Open Original
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                window.location.origin +
                                                    fileUrl,
                                            );
                                        }}
                                    >
                                        <Copy className="mr-2 h-4 w-4" /> Copy
                                        Direct Link
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
