import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    FileText, 
    Image as ImageIcon, 
    Archive, 
    UploadCloud, 
    HardDrive,
    X,
    Plus,
    Images
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface Props {
    data: any;
    onChange: (data: any) => void;
}

export default function FileUploadForm({ data, onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Map backend property "accepted_file_types" to local UI state
    const selectedType = data.accepted_file_types || 'image';
    
    // Backend provides 'media' array. We also handle 'referenceImages' for new local uploads.
    // In edit mode, 'media' contains objects with 'path'.
    const existingMedia = data.media || [];

    const fileTypes = [
        { id: 'pdf', label: 'PDF', icon: FileText },
        { id: 'image', label: 'Image', icon: ImageIcon },
        { id: 'zip', label: 'Zip', icon: Archive },
    ];

    // Helper to resolve image source (handles both backend paths and base64)
    const getFilePreview = (item: any) => {
        if (typeof item === 'string') return item; // Base64 or Blob
        if (item.path) {
            // Adjust this URL based on your backend storage config
            return `${import.meta.env.VITE_ASSET_URL || ''}/storage/${item.path}`;
        }
        return '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // We append new images to the media array as base64 strings
                // The backend should handle strings as new files and objects as existing
                onChange({ 
                    ...data, 
                    media: [...existingMedia, reader.result as string] 
                });
            };
            reader.readAsDataURL(file);
        });
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const updatedMedia = existingMedia.filter((_: any, i: number) => i !== index);
        onChange({ ...data, media: updatedMedia });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
            
            {/* Instruction Field */}
            <div className="space-y-3">
                <Label htmlFor="question" className="text-sm font-semibold text-slate-700 ml-1">
                    Upload Instructions
                </Label>
                <Textarea
                    id="question"
                    required
                    placeholder="e.g., Please design a poster based on the examples provided below..."
                    className="min-h-[100px] bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-base shadow-sm"
                    value={data.question || ""}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
            </div>

            {/* Multi-Image Upload Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <Label className="text-sm font-semibold text-slate-700">
                        Reference Examples ({existingMedia.length})
                    </Label>
                    {existingMedia.length > 0 && (
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add More
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingMedia.map((item: any, index: number) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm bg-slate-100">
                            <img 
                                src={getFilePreview(item)} 
                                alt="Example" 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-1.5 bg-white rounded-full text-rose-500 hover:scale-110 transition-transform"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* The "Add" Square Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all aspect-square",
                            existingMedia.length === 0 
                                ? "col-span-full h-32 border-slate-200 hover:border-primary hover:bg-primary/5" 
                                : "border-slate-200 hover:border-primary hover:bg-primary/5"
                        )}
                    >
                        <div className="p-2 bg-slate-50 rounded-full">
                            <Images className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {existingMedia.length === 0 ? "Add Example Images" : "Add Another"}
                        </span>
                    </button>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                />
            </div>

            <hr className="border-slate-100" />

            {/* Constraints Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">
                        Student Submission Format
                    </Label>
                    <div className="flex gap-2">
                        {fileTypes.map((type) => {
                            const Icon = type.icon;
                            const isActive = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => onChange({ ...data, accepted_file_types: type.id })}
                                    className={cn(
                                        "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                                        isActive 
                                            ? `border-primary bg-primary/5 shadow-sm` 
                                            : "border-slate-100 bg-white hover:border-slate-200"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                                    <span className={cn("text-xs font-bold", isActive ? "text-primary" : "text-slate-500")}>
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">
                        Max Size Limit
                    </Label>
                    <div className="relative group">
                        <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                            type="number" 
                            placeholder="10" 
                            className="pl-10 h-11 bg-white border-slate-200 focus:ring-primary/10"
                            value={data.max_file_size || ''}
                            onChange={(e) => onChange({...data, max_file_size: e.target.value})} 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            MB
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3">
                <UploadCloud className="w-6 h-6 text-slate-400" />
                <div>
                    <p className="text-sm font-semibold text-slate-600">Submission Zone Preview</p>
                    <p className="text-xs text-slate-400 mt-1">
                        Students will upload their <span className="font-bold text-slate-600 uppercase">{selectedType}</span> here.
                    </p>
                </div>
            </div>
        </div>
    );
}