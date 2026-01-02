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

    
    // Robust check to see if the answer is a browser File object
    const isFileObject = (obj) => {
        return obj && typeof obj === 'object' && 'name' in obj && 'size' in obj;
    };

    // Clean up preview URLs to prevent memory leaks
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

    const validateAndUpload = useCallback(
        (file) => {
            if (!file) return;

            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                alert(
                    `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max limit is ${MAX_SIZE_MB}MB.`,
                );
                return;
            }

            onChange(question.id, file);
        },
        [MAX_SIZE_MB, question.id, onChange],
    );

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover')
            setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

return (
    <div className="group w-full rounded-3xl border-2 border-transparent bg-card p-6 shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:ring-primary/30">
        <div className="mb-4 flex items-start justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                <HardDrive className="h-3.5 w-3.5" />
                {question.point} Points
            </span>
            <span className="text-xs font-medium text-description italic">
                {ACCEPTED_TYPE.toUpperCase()} (Max {MAX_SIZE_MB}MB)
            </span>
        </div>

        <h3 className="mb-6 text-xl leading-tight font-bold text-title transition-colors group-hover:text-primary">
            {question.question}
        </h3>

        {/* Media Illustration */}
        {question.media?.map(
            (m) =>
                m.type === 'image' && (
                    <div
                        key={m.id}
                        className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted shadow-inner"
                    >
                        <img
                            src={`/storage/${m.path}`}
                            alt="Context"
                            className="max-h-64 w-full object-contain"
                        />
                    </div>
                ),
        )}

        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !answer && fileInputRef.current?.click()}
            className={`relative flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 
                ${isDragging ? 'scale-[1.01] border-primary bg-primary/5' : 'border-border bg-muted/30'} 
                ${answer ? 'border-success bg-success/5' : 'cursor-pointer hover:border-primary/50 hover:bg-card'} `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={getAcceptAttribute(ACCEPTED_TYPE)}
                className="hidden"
            />

            {!answer ? (
                <div className="animate-in duration-400 fade-in slide-in-from-bottom-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20">
                        <Upload className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-bold text-title">
                        Click or drag file to upload
                    </h4>
                    <p className="mt-1 text-sm text-description">
                        Safe and secure submission
                    </p>
                </div>
            ) : (
                <div className="flex w-full animate-in flex-col items-center gap-6 duration-200 zoom-in-95 md:flex-row">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-card bg-card shadow-md">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                <FileIcon className="h-8 w-8" />
                            </div>
                        )}
                    </div>

                    <div className="flex-grow text-left">
                        <div className="mb-1 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-success" />
                            <span className="max-w-[200px] truncate font-bold text-title">
                                {answer.name || 'File Selected'}
                            </span>
                        </div>
                        <p className="text-sm text-description">
                            {answer.size
                                ? `${(answer.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Ready to submit'}
                        </p>
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(question.id, null);
                        }}
                        className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    </div>
);
}
