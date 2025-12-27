import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    MoreHorizontalIcon, 
    PencilIcon, 
    Copy, 
    TrashIcon, 
    Clock, 
    Lock, 
    ArrowRight, 
    BookOpen 
} from 'lucide-react';
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
    description?: string;
    cover: string | null;
    visibility: 'public' | 'private';
    code?: string;
}

interface SubjectCardProps {
    subject: Subject;
    classId: number;
    onEdit: (subject: Subject) => void;
    onCopy: (subject: Subject) => void;
    onDelete: (subject: Subject) => void;
}

export default function SubjectCard({ subject, classId, onEdit, onCopy, onDelete }: SubjectCardProps) {
    const isPrivate = subject.visibility === 'private';

    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
            layoutId={`subject-card-${subject.id}`}
            className="group relative"
        >
            {/* Instructor Actions Dropdown - Positioned absolutely over the card */}
            <div className="absolute top-4 right-4 z-30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full border border-white/20 bg-black/60 shadow-lg backdrop-blur-md hover:bg-black/80 text-white"
                        >
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-xl">
                        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            Management
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(subject)} className="rounded-lg cursor-pointer">
                            <PencilIcon className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCopy(subject)} className="rounded-lg cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
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

            <Link href={route('instructor.classes.subjects.show', [classId, subject.id])}>
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#09090b]">
                    
                    {/* Cover Image Section */}
                    <div className="relative h-44 w-full overflow-hidden">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: `url('${subject.cover ? `/storage/${subject.cover}` : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Glass Visibility Badge */}
                        {isPrivate && (
                            <div className="absolute top-4 left-4 rounded-lg border border-white/20 bg-black/60 p-1.5 text-white backdrop-blur-md">
                                <Lock size={12} strokeWidth={3} />
                            </div>
                        )}

                        {/* Hover Action Label */}
                        <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-white uppercase">
                                Manage Lessons <ArrowRight size={12} />
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        <div className="mb-2 flex items-start justify-between">
                            <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 uppercase">
                                {subject.code || 'CURRICULUM'}
                            </span>
                        </div>
                        
                        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-tight font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                            {subject.name}
                        </h3>

                        {/* Footer Section */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-400 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span className="text-xs font-bold">
                                    {subject.visibility === 'public' ? 'Public Access' : 'Private Draft'}
                                </span>
                            </div>
                            
                            {/* Visual indicator of "Editing" capability */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
                                <BookOpen size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}