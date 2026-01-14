import { useState } from 'react';
import Can from '@/components/permission/can';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/permission/useCan';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { Edit2, School, CheckCircle2, Lock, Copy, Check, Hash } from 'lucide-react';
import { route } from 'ziggy-js';

interface Classroom {
    id: number;
    name: string;
    description: string;
    batch: string | number;
    shift: string;
    year: string | number;
    code: string; 
    cover?: string;
    joined?: boolean;
    visibility?: string;
}

interface ClassCardProps {
    classroom: Classroom;
    onEdit: (classroom: Classroom) => void;
}

const FALLBACK_IMAGE = `/assets/img/class/39323.jpg`;

export default function ClassCard({ classroom, onEdit }: ClassCardProps) {
    const { url } = usePage();
    const [copied, setCopied] = useState(false);
    const id = classroom.id;
    const canAccessInstructor = useCan('access-instructor-page');

    const backgroundImage = classroom?.cover
        ? `/storage/${classroom.cover}`
        : FALLBACK_IMAGE;

    const routeToClass =
        canAccessInstructor && url.includes('/instructor')
            ? route('instructor.classes.show', id)
            : route('student.classes.show', id);

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(classroom);
    };

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (classroom.code) {
            navigator.clipboard.writeText(classroom.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Link href={routeToClass} className="block group/link">
            <motion.div
                layoutId={`classroom-card-${classroom.id}`}
                className={`group relative h-56 sm:h-72 w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-card shadow-lg transition-all duration-500 ${
                    classroom.joined 
                    ? 'ring-2 ring-primary/50 shadow-2xl shadow-primary/20' 
                    : 'hover:shadow-2xl hover:shadow-black/30'
                }`}
                whileHover={{ y: -10 }}
            >
                {/* Background Image with Parallax-like scale */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />

                {/* Intelligent Dynamic Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                    classroom.joined 
                    ? 'bg-gradient-to-t from-primary/95 via-primary/40 to-black/20 opacity-90' 
                    : 'bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-90'
                }`} />

                {/* UI Content Layer */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                    
                    {/* Top Row: Badges & Actions */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            {classroom.joined ? (
                                <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[10px] font-black tracking-wider text-primary uppercase shadow-xl ring-1 ring-primary/10">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {/* Enrolled */}
                                    Joined
                                </span>
                            ) : (
                                <span className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-black tracking-widest text-primary-foreground uppercase shadow-lg">
                                    {classroom?.visibility}
                                    {/* {classroom?.shift} */}
                                </span>
                            )}
                            
                            {/* Classroom Code Interactive Badge */}
                            <button
                                onClick={copyToClipboard}
                                className="group/code relative flex items-center gap-2 overflow-hidden rounded-full bg-black/30 px-4 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition-all hover:bg-black/50 active:scale-90 border border-white/10"
                            >
                                <Hash className={`h-3 w-3 transition-colors ${copied ? 'text-green-400' : 'text-primary-foreground'}`} />
                                <span className="font-mono tracking-wider">{classroom.code}</span>
                                <div className="ml-1 border-l border-white/20 pl-2">
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                key="check"
                                            >
                                                <Check className="h-3.5 w-3.5 text-green-400" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key="copy"
                                            >
                                                <Copy className="h-3 w-3 opacity-60 group-hover/code:opacity-100" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </div>

                        {/* Instructor Actions */}
                        <Can permission="access-instructor-page">
                            <Button
                                variant="secondary"
                                size="icon"
                                // className="h-10 w-10 shrink-0 rounded-2xl bg-white/10 text-white opacity-0 blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:blur-0 hover:bg-white hover:text-primary"
                                onClick={handleEditClick}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Can>
                    </div>

                    {/* Bottom Row: Info */}
                    <div className="space-y-3">
                        <div className="space-y-1">
                            {classroom.visibility === 'private' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-300 uppercase tracking-widest">
                                    <Lock className="h-2.5 w-2.5" /> Private Session
                                </span>
                            )}
                            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-2xl">
                                {classroom?.name}
                            </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/90">
                            <div className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1 backdrop-blur-sm">
                                {/* <School className="h-4 w-4 text-primary-foreground" /> */}
                                <span>Y{classroom?.year} S{classroom?.semester}</span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-white/40" />
                            <span className="rounded-lg bg-white/10 px-2 py-1 backdrop-blur-sm">
                                Batch {classroom?.batch}
                            </span>
                        </div>
                        
                        <p className="line-clamp-2 text-xs font-medium text-white/70 italic leading-relaxed">
                            {classroom?.description || 'Explore this classroom to start your journey.'}
                        </p>
                    </div>
                </div>

                {/* Progress-style bottom bar for active classes */}
                {classroom.joined && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-primary via-white to-primary" 
                    />
                )}
            </motion.div>
        </Link>
    );
}