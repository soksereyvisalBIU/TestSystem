// import { Link } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { Edit2, School } from 'lucide-react'; // Import Edit icon
// import { Button } from '@/components/ui/button';
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
//     const id = classroom?.id;
//     const backgroundImage = `/storage/${classroom?.cover}` || FALLBACK_IMAGE;

//     const handleEditClick = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onEdit(classroom);
//     };

//     return (
//         <Link href={route('instructor.classes.show', id)} className="block">
//             <motion.div
//                 className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl transition-shadow hover:shadow-2xl hover:shadow-primary/20"
//                 whileHover={{ y: -8 }}
//                 transition={{ type: 'spring', stiffness: 300, damping: 15 }}
//             >
//                 {/* Image Layer */}
//                 <div 
//                     className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
//                     style={{ backgroundImage: `url('${backgroundImage}')` }}
//                 />
                
//                 {/* Advanced Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

//                 {/* Content */}
//                 <div className="absolute inset-0 flex flex-col justify-between p-6">
//                     <div className="flex justify-between items-start">
//                         <div className="flex gap-2">
//                             <span className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md ring-1 ring-white/20">
//                                 BATCH {classroom?.batch}
//                             </span>
//                             <span className="rounded-lg bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
//                                 {classroom?.shift}
//                             </span>
//                         </div>

//                         <Button
//                             variant="glass" // Custom variant for a blurred white button
//                             size="icon"
//                             className="h-10 w-10 rounded-xl bg-white/10 text-white backdrop-blur-lg hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
//                             onClick={handleEditClick}
//                         >
//                             <Edit2 className="h-4 w-4" />
//                         </Button>
//                     </div>

//                     <div className="space-y-2">
//                         <h3 className="text-2xl font-bold leading-tight text-white group-hover:text-primary transition-colors">
//                             {classroom?.name}
//                         </h3>
//                         <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
//                             <span className="flex items-center gap-1">
//                                 <School className="h-3 w-3" /> {classroom?.year}
//                             </span>
//                             <span>•</span>
//                             <p className="line-clamp-1 italic opacity-80">
//                                 {classroom?.description || "No description."}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         </Link>
//     );
// }