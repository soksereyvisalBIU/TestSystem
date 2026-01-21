// import { motion } from 'framer-motion';
// import { BookOpen, Users } from 'lucide-react';
// export function ClassroomHeader({ classroom }: any) {

//     const subjects = classroom?.subjects ?? [];
    
//     return (
//         <motion.div
//             layoutId={`classroom-card-${classroom.id}`}
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="group relative h-[320px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
//         >
//             <div
//                 className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
//                 style={{
//                     backgroundImage: `url('${classroom.cover ? '/storage/' + classroom.cover : '/assets/img/class/39323.jpg'}')`,
//                 }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

//             <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
//                 <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
//                     <div className="space-y-4">
//                         <div className="flex flex-wrap gap-2">
//                             <span className="rounded-lg bg-blue-500 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/40">
//                                 Batch {classroom.batch}
//                             </span>
//                             <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
//                                 {classroom.shift === 1
//                                     ? 'Morning Session'
//                                     : 'Evening Session'}
//                             </span>
//                         </div>
//                         <h1 className="text-4xl font-[1000] tracking-tighter text-white uppercase md:text-6xl">
//                             {classroom.name}
//                         </h1>
//                         <p className="line-clamp-2 max-w-xl leading-relaxed font-medium text-slate-300">
//                             {classroom.description ||
//                                 'Advancing technical excellence in the Faculty of IT & Science.'}
//                         </p>
//                     </div>

//                     {/* Class Stats Overlay */}
//                     <div className="hidden gap-4 rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-xl lg:flex">
//                         <StatMini icon={Users} label="Students" value="32" />
//                         <div className="h-10 w-px self-center bg-white/10" />
//                         <StatMini
//                             icon={BookOpen}
//                             label="Subjects"
//                             value={subjects.length.toString()}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// }


// // Sub-components for better organization
// function StatMini({
//     icon: Icon,
//     label,
//     value,
// }: {
//     icon: any;
//     label: string;
//     value: string;
// }) {
//     return (
//         <div className="px-4 text-center">
//             <div className="mb-1 flex items-center gap-2 text-blue-400">
//                 <Icon size={14} />
//                 <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
//                     {label}
//                 </span>
//             </div>
//             <div className="text-xl font-black text-white">{value}</div>
//         </div>
//     );
// }


import { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';

// Memoize the stat component to prevent unnecessary re-renders during parent animations
const StatMini = memo(({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) => (
    <div className="px-4 text-center transform-gpu">
        <div className="mb-1 flex items-center gap-2 text-white/60">
            <Icon size={14} className="text-primary" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                {label}
            </span>
        </div>
        <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
    </div>
));

StatMini.displayName = 'StatMini';

export function ClassroomHeader({ classroom }: any) {
    const subjectsCount = classroom?.subjects?.length ?? 0;
    const coverUrl = classroom.cover 
        ? `/storage/${classroom.cover}` 
        : '/assets/img/class/39323.jpg';

    return (
        <motion.div
            layoutId={`classroom-card-${classroom.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="group relative h-[240px] sm:h-[360px] w-full overflow-hidden rounded-[1.5rem] sm:rounded-[3rem] bg-slate-900 shadow-2xl shadow-black/40"
        >
            {/* Optimized Background Image Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2.5s] ease-out group-hover:scale-105 will-change-transform transform-gpu"
                style={{
                    backgroundImage: `url('${coverUrl}')`,
                }}
            />
            
            {/* Layered Gradient for Contrast Performance */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />

            <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 md:p-16">
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-3">
                            {/* Primary Badge */}
                            <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-1.5 shadow-xl shadow-primary/20">
                                <span className="text-[10px] font-black tracking-widest text-primary-foreground uppercase">
                                    Batch {classroom.batch}
                                </span>
                            </div>
                            
                            {/* Glass Badge */}
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-xl">
                                <span className="text-[10px] font-black tracking-widest text-white uppercase opacity-90">
                                    {classroom.shift === 1 ? 'Morning' : 'Evening'} Session
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-[ -0.04em] text-white uppercase sm:text-5xl md:text-7xl drop-shadow-xl animate-in slide-in-from-left-4 duration-700">
                                {classroom.name}
                            </h1>

                            <p className="line-clamp-2 max-w-2xl text-base font-medium leading-relaxed text-white/70 sm:text-lg">
                                {classroom.description || 'Developing future-ready engineering expertise through technical excellence.'}
                            </p>
                        </div>
                    </div>

                    {/* Stats Section with Hardware Acceleration */}
                    <div className="hidden gap-2 rounded-[2rem] border border-white/5 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-3xl lg:flex transform-gpu transition-all hover:bg-white/[0.06]">
                        <StatMini icon={Users} label="Students" value="32" />
                        <div className="h-10 w-px self-center bg-white/10" />
                        <StatMini
                            icon={BookOpen}
                            label="Modules"
                            value={subjectsCount.toString()}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}