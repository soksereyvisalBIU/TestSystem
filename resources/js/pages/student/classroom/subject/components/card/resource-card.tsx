import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/student/assessment';
import { motion } from 'framer-motion';
import { 
    Download, 
    FileText, 
    FileSpreadsheet, 
    FileCode, 
    File as FileIcon,
    MoreVertical,
    Eye
} from 'lucide-react';

interface ResourceCardProps {
    resource: Resource;
    onDownload?: (resourceId: number) => void;
}

// Helper to determine icon and color based on file type
const getFileMeta = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' };
    if (t.includes('xls') || t.includes('csv')) return { icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (t.includes('doc')) return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
    if (t.includes('zip') || t.includes('rar')) return { icon: FileCode, color: 'text-amber-600', bg: 'bg-amber-50' };
    return { icon: FileIcon, color: 'text-slate-600', bg: 'bg-slate-50' };
};

export function ResourceCard({ resource, onDownload }: ResourceCardProps) {
    const { icon: Icon, color, bg } = getFileMeta(resource.type);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.005 }}
            className="group relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                {/* Visual File Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${bg} ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>

                <div className="flex flex-col gap-1">
                    <p className="font-bold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                        {resource.name}
                    </p>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`border-none px-0 text-[10px] font-black uppercase tracking-widest ${color}`}>
                            {resource.type}
                        </Badge>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-[11px] font-bold text-slate-400">{resource.size}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* Secondary Action: Preview */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:flex"
                    onClick={() => console.log('Preview')}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {/* Primary Action: Download */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-90"
                    onClick={() => onDownload?.(resource.id)}
                >
                    <Download className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
}