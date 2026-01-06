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
// import { url } from 'inspector';

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
    // Optional management props
    onEdit?: (subject: Subject) => void;
    onCopy?: (subject: Subject) => void;
    onDelete?: (subject: Subject) => void;
    // Capability check
    // canManage?: boolean; 
}

export default function SubjectCard({ 
    subject, 
    classId, 
    onEdit, 
    onCopy, 
    onDelete,
    // canManage = false 
}: SubjectCardProps) {

    const canAccessInstructor = useCan('access-instructor-page');
    
    const isPrivate = subject.visibility === 'private';
    const {url} = usePage();

    // Determine the route based on role
    const showRoute = canAccessInstructor && url.includes('/instructor') 
        ? route('instructor.classes.subjects.show', [classId, subject.id])
        : route('student.classes.subjects.show', [classId, subject.id]);

    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
            className="group relative"
        >
            {/* INSTRUCTOR ONLY: Management Dropdown */}
            {canAccessInstructor && (
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
                                Instructor Tools
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit?.(subject)} className="rounded-lg cursor-pointer">
                                <PencilIcon className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCopy?.(subject)} className="rounded-lg cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete?.(subject)}
                                className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                                <TrashIcon className="mr-2 h-4 w-4" /> Delete Subject
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <Link href={showRoute}>
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#09090b]">
                    
                    {/* Cover Image Section */}
                    <div className="relative h-28 sm:h-44 w-full overflow-hidden">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: `url('${subject.cover ? `/storage/${subject.cover}` : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Visibility / Role Badge */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {isPrivate && (
                                <div className="rounded-lg border border-white/20 bg-black/60 p-1.5 text-white backdrop-blur-md">
                                    <Lock size={12} strokeWidth={3} />
                                </div>
                            )}
                            {canAccessInstructor && (
                                <div className="rounded-lg border border-white/20 bg-blue-600/60 p-1.5 text-white backdrop-blur-md">
                                    <ShieldCheck size={12} strokeWidth={3} />
                                </div>
                            )}
                        </div>

                        {/* Hover Call to Action */}
                        <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-white uppercase">
                                {canAccessInstructor ? 'Manage Module' : 'View Module'} <ArrowRight size={12} />
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-6">
                        <div className="mb-2 flex items-start justify-between">
                            <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 uppercase">
                                {subject.code || 'IT-MOD'}
                            </span>
                        </div>
                        
                        <h3 className="line-clamp-2 min-h-[2rem] sm:min-h-[3.5rem] text-lg leading-tight font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                            {subject.name}
                        </h3>

                        {/* Footer Section */}
                        <div className="sm:mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-400 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span className="text-xs font-bold">
                                    {canAccessInstructor ? (isPrivate ? 'Draft Mode' : 'Live on Portal') : '12 Lectures'}
                                </span>
                            </div>
                            
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