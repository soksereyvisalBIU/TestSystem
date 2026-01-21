import Can from '@/components/permission/can';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/permission/useCan';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Edit2, Lock } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

interface Classroom {
    id: number;
    name: string;
    description: string;
    batch: string | number;
    shift: string;
    year: string | number;
    semester?: string | number;
    code: string;
    cover?: string;
    joined?: boolean;
    visibility?: string;
}

interface ClassCardProps {
    classroom: Classroom;
    onEdit?: (classroom: Classroom) => void;
}

const FALLBACK_IMAGE = `/assets/img/class/39323.jpg`;

// Move static animation configs outside to save memory
const HOVER_ANIMATION = { y: -10 };
const TRANSITION_CONFIG = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

const ClassCard = memo(function ClassCard({
    classroom,
    onEdit,
}: ClassCardProps) {
    const { url } = usePage();
    const [copied, setCopied] = useState(false);
    const canAccessInstructor = useCan('access-instructor-page');

    // 1. Memoize derived paths and assets
    const { backgroundImage, routeToClass } = useMemo(
        () => ({
            backgroundImage: classroom?.cover
                ? `/storage/${classroom.cover}`
                : FALLBACK_IMAGE,
            routeToClass:
                canAccessInstructor && url.includes('/instructor')
                    ? route('instructor.classes.show', classroom.id)
                    : route('student.classes.show', classroom.id),
        }),
        [classroom.id, classroom.cover, canAccessInstructor, url],
    );

    // 2. Optimized Event Handlers
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(classroom);
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
        <Link prefetch href={routeToClass} className="group/link block outline-none">
            <motion.div
                layoutId={`classroom-card-${classroom.id}`}
                className={`group relative h-56 w-full overflow-hidden rounded-[2.5rem] bg-card transition-all duration-500 will-change-transform sm:h-72 ${
                    classroom.joined
                        ? 'shadow-2xl ring-2 shadow-primary/20 ring-primary/50'
                        : 'shadow-lg hover:shadow-2xl hover:shadow-black/30'
                }`}
                whileHover={HOVER_ANIMATION}
                transition={TRANSITION_CONFIG}
            >
                {/* Background Image: GPU accelerated scaling */}
                <div
                    className="absolute inset-0 transform-gpu bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />

                {/* Performance Optimized Overlay */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        classroom.joined
                            ? 'bg-gradient-to-t from-primary/95 via-primary/40 to-black/20 opacity-90'
                            : 'bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-90'
                    }`}
                />

                {/* UI Content Layer */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {classroom.joined ? (
                                <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[10px] font-black tracking-wider text-primary uppercase shadow-xl">
                                    {/* <CheckCircle2 className="h-3.5 w-3.5" />  */}
                                    Joined
                                </span>
                            ) : (
                                <span className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-black tracking-widest text-primary-foreground uppercase shadow-lg">
                                    {classroom?.visibility}
                                </span>
                            )}

                            <button
                                onClick={copyToClipboard}
                                className="group/code relative flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-[11px] font-bold text-white backdrop-blur-md transition-all hover:bg-black/50 active:scale-95"
                            >
                                {/* <Hash className={`h-3 w-3 ${copied ? 'text-green-400' : 'text-primary-foreground'}`} /> */}
                                <span className="font-mono tracking-wider">
                                    {classroom.code}
                                </span>
                                <div className="ml-1 border-l border-white/20 pl-2">
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                initial={{ y: 5, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -5, opacity: 0 }}
                                                key="check"
                                            >
                                                <Check className="h-3.5 w-3.5 text-green-400" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key="copy"
                                            >
                                                <Copy className="h-3 w-3 opacity-60 group-hover/code:opacity-100" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </button>
                        </div>

                        <Can permission="access-instructor-page">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-primary"
                                onClick={handleEditClick}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Can>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            {classroom.visibility === 'private' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-red-300 uppercase">
                                    <Lock className="h-2.5 w-2.5" /> Private
                                    Session
                                </span>
                            )}
                            <h3 className="text-2xl leading-tight font-black text-white drop-shadow-md sm:text-3xl">
                                {classroom?.name}
                            </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white/90">
                            <div className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/10 px-2 py-1 backdrop-blur-sm">
                                <span>
                                    Y{classroom?.year} S
                                    {classroom?.semester || 1}
                                </span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-white/40" />
                            <span className="rounded-lg border border-white/5 bg-white/10 px-2 py-1 backdrop-blur-sm">
                                Batch {classroom?.batch}
                            </span>
                        </div>

                        <p className="line-clamp-2 text-xs leading-relaxed font-medium text-white/70 italic">
                            {classroom?.description ||
                                'Explore this classroom to start your journey.'}
                        </p>
                    </div>
                </div>

                {/* Progress-style bottom bar - transform-gpu for smooth rendering */}
                {classroom.joined && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute right-0 bottom-0 left-0 h-1.5 origin-left transform-gpu bg-gradient-to-r from-primary via-blue-400 to-primary"
                    />
                )}
            </motion.div>
        </Link>
    );
});

export default ClassCard;
