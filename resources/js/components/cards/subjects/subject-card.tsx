// import { Link } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { ArrowRight, Clock, Edit3, Lock } from 'lucide-react';
// import { route } from 'ziggy-js';

// export default function SubjectCard({
//     subj,
//     classroomId,
// }: {
//     subj: any;
//     classroomId: number;
// }) {
//     const isPrivate = subj.visibility === 'private';

//     return (
//         <motion.div
//             layout
//             variants={{
//                 hidden: { opacity: 0, y: 20 },
//                 show: { opacity: 1, y: 0 },
//             }}
//             whileHover={{ y: -5 }}
//             layoutId={`subject-card-${subj.id}`}
//             className="group relative"
//         >
//             <Link
//                 href={route('student.classes.subjects.show', [
//                     classroomId,
//                     subj.id,
//                 ])}
//             >
//                 <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#09090b]">
//                     {/* Cover Image with Glass Tag */}
//                     <div className="relative h-44 w-full overflow-hidden">
//                         <div
//                             className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                             style={{
//                                 backgroundImage: `url('${subj.cover ? '/storage/' + subj.cover : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'}')`,
//                             }}
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//                         {isPrivate && (
//                             <div className="absolute top-4 left-4 rounded-lg border border-white/20 bg-black/60 p-1.5 text-white backdrop-blur-md">
//                                 <Lock size={12} strokeWidth={3} />
//                             </div>
//                         )}

//                         <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//                             <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-white uppercase">
//                                 View Module <ArrowRight size={12} />
//                             </span>
//                         </div>
//                     </div>

//                     <div className="p-6">
//                         <div className="mb-2 flex items-start justify-between">
//                             <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 uppercase">
//                                 {subj.code || 'IT-MOD'}
//                             </span>
//                         </div>
//                         <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-tight font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
//                             {subj.name}
//                         </h3>

//                         <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-400 dark:border-slate-800">
//                             <div className="flex items-center gap-2">
//                                 <Clock size={14} />
//                                 <span className="text-xs font-bold">
//                                     12 Lectures
//                                 </span>
//                             </div>
//                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
//                                 <Edit3 size={14} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Link>
//         </motion.div>
//     );
// }

import { useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    MoreHorizontalIcon, 
    PencilIcon, 
    Copy, 
    TrashIcon, 
    Clock, 
    Lock, 
    ArrowRight, 
    BookOpen,
    ShieldCheck
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
import { useCan } from '@/hooks/permission/useCan';

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
    onEdit?: (subject: Subject) => void;
    onCopy?: (subject: Subject) => void;
    onDelete?: (subject: Subject) => void;
}

export default function SubjectCard({ 
    subject, 
    classId, 
    onEdit, 
    onCopy, 
    onDelete 
}: SubjectCardProps) {
    const canAccessInstructor = useCan('access-instructor-page');
    const { url } = usePage();
    const isPrivate = subject.visibility === 'private';

    // Memoize the route to avoid recalculation on hover states
    const showRoute = useMemo(() => {
        const isInstructorPath = canAccessInstructor && url.startsWith('/instructor');
        return isInstructorPath 
            ? route('instructor.classes.subjects.show', [classId, subject.id])
            : route('student.classes.subjects.show', [classId, subject.id]);
    }, [canAccessInstructor, url, classId, subject.id]);

    // Fast image path resolution
    const coverImage = subject.cover 
        ? `/storage/${subject.cover}` 
        : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=500&auto=format&fit=crop';

    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1 },
            }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            whileHover={{ y: -8 }}
            className="group transform-gpu"
        >
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl dark:border-slate-800 dark:bg-[#09090b]">
                
                {/* INSTRUCTOR TOOLS: Absolute positioned to avoid layout shifts */}
                {canAccessInstructor && (
                    <div className="absolute top-4 right-4 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-9 w-9 rounded-2xl border border-white/20 bg-black/40 shadow-lg backdrop-blur-xl hover:bg-black/60 text-white transition-all"
                                >
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    Management
                                </DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit?.(subject)} className="rounded-xl cursor-pointer py-2.5">
                                    <PencilIcon className="mr-2 h-4 w-4" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onCopy?.(subject)} className="rounded-xl cursor-pointer py-2.5">
                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2" />
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(subject)}
                                    className="rounded-xl cursor-pointer py-2.5 text-destructive focus:bg-destructive/10"
                                >
                                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <Link prefetch href={showRoute} className="flex flex-col h-full">
                    {/* Visual Section */}
                    <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 will-change-transform"
                            style={{ backgroundImage: `url('${coverImage}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {isPrivate && (
                                <div className="rounded-xl border border-white/20 bg-black/40 p-2 text-white backdrop-blur-md">
                                    <Lock size={14} strokeWidth={2.5} />
                                </div>
                            )}
                            {canAccessInstructor && (
                                <div className="rounded-xl border border-white/20 bg-blue-600/80 p-2 text-white backdrop-blur-md">
                                    <ShieldCheck size={14} strokeWidth={2.5} />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-4 left-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white uppercase">
                                {canAccessInstructor ? 'Open Instructor Panel' : 'Explore Module'} 
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-6">
                        <span className="mb-2 text-[10px] font-black tracking-widest text-blue-500 uppercase">
                            {subject.code || 'MOD-001'}
                        </span>
                        
                        <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 dark:text-white transition-colors group-hover:text-blue-600">
                            {subject.name}
                        </h3>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800/50">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={14} className="text-blue-500" />
                                <span className="text-xs font-bold tracking-tight">
                                    {canAccessInstructor ? (isPrivate ? 'Draft' : 'Live') : 'Self-Paced'}
                                </span>
                            </div>
                            
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-900">
                                <BookOpen size={18} />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
}