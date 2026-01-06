import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    File as FileIcon,
    HardDrive,
    Upload,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function FileUploadQuestion({ question, answer, onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const MAX_SIZE_MB = question.max_file_size || 10;
    const ACCEPTED_TYPE = question.accepted_file_types || 'any';

    const isFileObject = (obj) => obj && typeof obj === 'object' && 'name' in obj;

    useEffect(() => {
        if (isFileObject(answer) && answer.type?.startsWith('image/')) {
            const url = URL.createObjectURL(answer);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [answer]);

    const getAcceptAttribute = (type) => {
        const types = {
            image: 'image/jpeg,image/png,image/webp,image/gif',
            pdf: '.pdf',
            zip: '.zip,.rar,.7z',
            code: '.js,.py,.cpp,.java,.txt,.html,.css',
        };
        return types[type] || '*';
    };

    const validateAndUpload = useCallback((file) => {
        if (!file) return;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`File too large. Max limit is ${MAX_SIZE_MB}MB.`);
            return;
        }
        onChange(question.id, file);
    }, [MAX_SIZE_MB, question.id, onChange]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) validateAndUpload(e.dataTransfer.files[0]);
    };

    return (
        <div className="group w-full rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all duration-300">
            {/* Header Info */}
            <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    <HardDrive className="h-3 w-3" />
                    {question.point} pts
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                    {ACCEPTED_TYPE} • {MAX_SIZE_MB}MB
                </span>
            </div>

            <h3 className="mb-4 text-base sm:text-xl font-bold text-title leading-tight">
                {question.question}
            </h3>

            {/* Main Dropzone / Result Area */}
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => !answer && fileInputRef.current?.click()}
                className={`relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all 
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'} 
                    ${answer ? 'border-emerald-500 bg-emerald-500/5' : 'cursor-pointer active:scale-[0.98]'}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && validateAndUpload(e.target.files[0])}
                    accept={getAcceptAttribute(ACCEPTED_TYPE)}
                    className="hidden"
                />

                {!answer ? (
                    <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                            <Upload className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm font-bold text-title">Tap to upload</h4>
                        <p className="text-[11px] text-muted-foreground">Select a file from your device</p>
                    </div>
                ) : (
                    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:text-left">
                        {/* Preview Thumbnail */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <FileIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* File Details */}
                        <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                <span className="truncate text-xs font-bold text-title">
                                    {answer.name}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase mt-0.5">
                                {(answer.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>

                        {/* Action */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(question.id, null);
                            }}
                            className="h-8 w-full sm:w-auto text-destructive hover:bg-destructive/10 text-xs font-bold"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            Remove
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}