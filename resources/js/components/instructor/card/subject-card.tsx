import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoreHorizontalIcon, PencilIcon, Copy, TrashIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { route } from 'ziggy-js';

interface Subject {
    id: number;
    name: string;
    description: string;
    cover: string | null;
    visibility: 'public' | 'private';
}

interface SubjectCardProps {
    subject: Subject;
    classId: number;
    onEdit: (subject: Subject) => void;
    onCopy: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
}

export default function SubjectCard({ subject, classId, onEdit, onCopy, onDelete }: SubjectCardProps) {
    return (
        <motion.div
            layout
            // Use whileHover for a more responsive feel than CSS transitions
            whileHover={{ y: -5 }}
            className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
        >
            {/* Action Overlay - Hidden by default, appears on hover for cleaner UI */}
            <div className="absolute top-3 right-3 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-white/95 shadow-lg backdrop-blur hover:bg-white"
                        >
                            <MoreHorizontalIcon className="h-5 w-5 text-slate-900" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-xl">
                        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Subject Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(subject)} className="rounded-lg cursor-pointer">
                            <PencilIcon className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCopy(subject)} className="rounded-lg cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /> Duplicate Subject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(subject)}
                            className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                            <TrashIcon className="mr-2 h-4 w-4" /> Delete Subject
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Link
                href={route('instructor.classes.subjects.show', [classId, subject.id])}
                className="flex flex-col h-full"
            >
                {/* Image Container */}
                <div className="relative h-44 w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{
                            backgroundImage: `url('${subject.cover ? `/storage/${subject.cover}` : 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000'}')`,
                        }}
                    />
                    {/* Dark gradient overlay for better text contrast/premium look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Floating Visibility Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                        {subject.visibility === 'public' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span className="uppercase tracking-widest">{subject.visibility}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                         <div className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            subject.visibility === 'public' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                            Curriculum
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {subject.name}
                    </h3>
                    
                    {subject.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
                            {subject.description}
                        </p>
                    )}

                    {/* Bottom visual "Footer" of card */}
                    <div className="mt-auto pt-4 flex items-center text-primary text-xs font-bold uppercase tracking-wider opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        View Lessons →
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}