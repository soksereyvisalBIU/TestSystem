import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    FileText, 
    Image as ImageIcon, 
    Archive, 
    UploadCloud, 
    AlertCircle,
    HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    data: any;
    onChange: (data: any) => void;
}

export default function FileUploadForm({ data, onChange }: Props) {
    const selectedType = data.fileType || 'pdf';

    const fileTypes = [
        { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'image', label: 'Image', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'zip', label: 'Zip', icon: Archive, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];

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
                    placeholder="e.g., Please upload your final project report as a PDF. Ensure all diagrams are included."
                    className="min-h-[100px] bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none text-base shadow-sm"
                    value={data.question || ""}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
            </div>

            {/* Constraints Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">
                        Accepted File Type
                    </Label>
                    <div className="flex gap-2">
                        {fileTypes.map((type) => {
                            const Icon = type.icon;
                            const isActive = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => onChange({ ...data, fileType: type.id })}
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

                {/* Max Size Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 ml-1">
                        Max File Size (MB)
                    </Label>
                    <div className="relative group">
                        <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                            type="number" 
                            placeholder="10" 
                            className="pl-10 h-11 bg-white border-slate-200 focus:ring-primary/10"
                            value={data.maxSize || ''}
                            onChange={(e) => onChange({...data, maxSize: e.target.value})} 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            MB
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                    <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-600">Student Upload Zone</p>
                    <p className="text-xs text-slate-400 mt-1">
                        Only <span className="font-bold text-slate-600 uppercase">{selectedType}</span> files up to {data.maxSize || '10'}MB will be accepted.
                    </p>
                </div>
            </div>

            <div className="flex gap-2 px-1">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-normal">
                    Students will see a file picker limited to your chosen format. Large files may take longer to process during submission.
                </p>
            </div>
        </div>
    );
}