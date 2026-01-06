// import Can from '@/components/permission/can';
// import { Button } from '@/components/ui/button';
// import { useCan } from '@/hooks/permission/useCan';
// import { Link, usePage } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { Edit2, School } from 'lucide-react'; // Import Edit icon
// import { route } from 'ziggy-js';

// interface Classroom {
//     id: number;
//     name: string;
//     description: string;
//     batch: string | number;
//     shift: string;
//     year: string | number;
//     cover?: string;
// }

// interface ClassCardProps {
//     classroom: Classroom;
//     onEdit: (classroom: Classroom) => void;
// }

// const FALLBACK_IMAGE = `/assets/img/class/39323.jpg`;

// export default function ClassCard({ classroom, onEdit }: ClassCardProps) {
//     const { url } = usePage();

//     const id = classroom.id;
//     const canAccessInstructor = useCan('access-instructor-page');

//     const backgroundImage = classroom?.cover
//         ? `/storage/${classroom.cover}`
//         : FALLBACK_IMAGE;

//     const routeToClass =
//         canAccessInstructor && url.includes('/instructor')
//             ? route('instructor.classes.show', id)
//             : route('student.classes.show', id); // ✅ adjust to your student route

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onEdit(classroom);
//     };

//     return (
//         <Link href={routeToClass} className="block">
//             <motion.div
//                 layoutId={`classroom-card-${classroom.id}`}
//                 className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl transition-shadow hover:shadow-2xl hover:shadow-primary/20"
//                 whileHover={{ y: -8 }}
//                 // transition={{ type: 'spring', stiffness: 300, damping: 15 }}
//             >
//                 {/* Image Layer */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                     style={{ backgroundImage: `url('${backgroundImage}')` }}
//                 />

//                 {/* Advanced Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

//                 {/* Content */}
//                 <div className="absolute inset-0 flex flex-col justify-between p-6">
//                     <div className="flex items-start justify-between">
//                         <div className="flex gap-2">
//                             <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase ring-1 ring-white/20 backdrop-blur-md">
//                                 BATCH {classroom?.batch}
//                             </span>
//                             <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground uppercase">
//                                 {classroom?.shift}
//                             </span>
//                         </div>

//                         <Can permission="access-instructor-page">
//                             <Button
//                                 variant="glass" // Custom variant for a blurred white button
//                                 size="icon"
//                                 className="h-10 w-10 translate-x-4 transform rounded-xl bg-white/10 text-white opacity-0 backdrop-blur-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-white hover:text-black"
//                                 onClick={handleEditClick}
//                             >
//                                 <Edit2 className="h-4 w-4" />
//                             </Button>
//                         </Can>
//                     </div>

//                     <div className="space-y-2">
//                         <h3 className="text-2xl leading-tight font-bold text-white transition-colors group-hover:text-shadow-lg group-hover:text-shadow-primary">
//                             {classroom?.name}
//                         </h3>
//                         <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
//                             <span className="flex items-center gap-1">
//                                 <School className="h-3 w-3" /> {classroom?.year}
//                             </span>
//                             <span>•</span>
//                             <p className="line-clamp-1 italic opacity-80">
//                                 {classroom?.description || 'No description.'}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>   
//         </Link>
//     );
// }


import Can from '@/components/permission/can';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/permission/useCan';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit2, School } from 'lucide-react';
import { route } from 'ziggy-js';

interface Classroom {
    id: number;
    name: string;
    description: string;
    batch: string | number;
    shift: string;
    year: string | number;
    cover?: string;
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
                // 1. Replaced shadow-xl with a dynamic shadow that works in both modes
                className="group relative h-42 sm:h-64 w-full cursor-pointer overflow-hidden rounded-[2rem] bg-card shadow-lg transition-all hover:shadow-2xl hover:shadow-primary/20"
                whileHover={{ y: -8 }}
            >
                {/* Image Layer */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />

                {/* 2. Adaptive Gradient Overlay 
                   In light mode, it adds a subtle darken; in dark mode, it blends with the bg-card color */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 transition-opacity group-hover:opacity-85" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                            {/* 3. Batch Badge - Glassmorphism is perfect for dark-on-image designs */}
                            <span className="rounded-lg bg-white/20 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md ring-1 ring-white/30">
                                BATCH {classroom?.batch}
                            </span>
                            <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-black tracking-widest text-primary-foreground uppercase shadow-md">
                                {classroom?.shift}
                            </span>
                        </div>

                        <Can permission="access-instructor-page">
                            <Button
                                variant="secondary" 
                                size="icon"
                                // 4. Refined Edit Button: Uses secondary variant for better theme consistency
                                className="h-10 w-10 translate-x-4 transform rounded-xl bg-white/20 text-white opacity-0 backdrop-blur-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-white hover:text-primary"
                                onClick={handleEditClick}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </Can>
                    </div>

                    <div className="space-y-2">
                        {/* 5. Title - Using text-white explicitly because it's on an image overlay */}
                        <h3 className="text-lg sm:text-2xl leading-tight font-black text-white group-hover:text-primary-foreground transition-colors drop-shadow-md">
                            {classroom?.name}
                        </h3>
                        
                        {/* 6. Sub-info - Replaced slate-300 with white/80 for consistent contrast on dark overlay */}
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
            </motion.div>
        </Link>
    );
}