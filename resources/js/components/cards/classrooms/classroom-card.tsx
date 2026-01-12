import Can from '@/components/permission/can';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/permission/useCan';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit2, School, CheckCircle2, Lock } from 'lucide-react';
import { route } from 'ziggy-js';

interface Classroom {
    id: number;
    name: string;
    description: string;
    batch: string | number;
    shift: string;
    year: string | number;
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

    return (
        <Link href={routeToClass} className="block">
            <motion.div
                layoutId={`classroom-card-${classroom.id}`}
                className={`group relative h-48 sm:h-64 w-full cursor-pointer overflow-hidden rounded-2xl xs:rounded-[2rem] bg-card shadow-lg transition-all duration-300 ${
                    classroom.joined 
                    ? 'ring-4 ring-primary/40 shadow-xl shadow-primary/20' 
                    : 'hover:shadow-2xl hover:shadow-black/20'
                }`}
                whileHover={{ y: -8 }}
            >
                {/* Image Layer */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />

                {/* Gradient Overlay - Slightly more colorful if joined */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                    classroom.joined 
                    ? 'bg-gradient-to-t from-primary/90 via-black/40 to-transparent opacity-80' 
                    : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-85'
                }`} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-wrap gap-2">
                            {/* Joined Status - High Visibility */}
                            {classroom.joined ? (
                                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-black tracking-wider text-primary uppercase shadow-lg ring-1 ring-primary/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Joined
                                </span>
                            ) : (
                                <>
                                    <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md ring-1 ring-white/30">
                                        BATCH {classroom?.batch}
                                    </span>
                                    {classroom.visibility === 'private' && (
                                        <span className="flex items-center gap-1 rounded-lg bg-red-500/80 px-3 py-1 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
                                            <Lock className="h-2.5 w-2.5" /> Private
                                        </span>
                                    )}
                                </>
                            )}
                            
                            {/* Standard Tag */}
                            {!classroom.joined && (
                                <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground uppercase shadow-md">
                                    {classroom?.shift}
                                </span>
                            )}
                        </div>

                        <Can permission="access-instructor-page">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-10 w-10 translate-x-4 transform rounded-xl bg-white/20 text-white opacity-0 backdrop-blur-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-white hover:text-primary"
                                onClick={handleEditClick}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Can>
                    </div>

                    <div className="space-y-2">
                        {/* Status Label for Joined items */}
                        {classroom.joined && (
                            <p className="text-[10px] font-bold text-primary-foreground/80 uppercase tracking-[0.2em]">
                                Currently Enrolled
                            </p>
                        )}
                        
                        <h3 className={`text-lg sm:text-2xl leading-tight font-black transition-colors drop-shadow-md ${
                            classroom.joined ? 'text-white' : 'text-white group-hover:text-primary-foreground'
                        }`}>
                            {classroom?.name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <span className="flex items-center gap-1">
                                <School className="h-3.5 w-3.5 text-primary-foreground" />
                                {classroom?.year}
                            </span>
                            <span className="opacity-40">•</span>
                            <p className="line-clamp-1 italic font-medium opacity-90">
                                {classroom?.description || 'No description available.'}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Bottom Bar for Joined Classes */}
                {classroom.joined && (
                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-primary" />
                )}
            </motion.div>
        </Link>
    );
}