import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
export function ClassroomHeader({ classroom }: any) {

    const subjects = classroom?.subjects ?? [];
    
    return (
        <motion.div
            layoutId={`classroom-card-${classroom.id}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative h-[320px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                style={{
                    backgroundImage: `url('${classroom.cover ? '/storage/' + classroom.cover : '/assets/img/class/39323.jpg'}')`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-lg bg-blue-500 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/40">
                                Batch {classroom.batch}
                            </span>
                            <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-md">
                                {classroom.shift === 1
                                    ? 'Morning Session'
                                    : 'Evening Session'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-[1000] tracking-tighter text-white uppercase md:text-6xl">
                            {classroom.name}
                        </h1>
                        <p className="line-clamp-2 max-w-xl leading-relaxed font-medium text-slate-300">
                            {classroom.description ||
                                'Advancing technical excellence in the Faculty of IT & Science.'}
                        </p>
                    </div>

                    {/* Class Stats Overlay */}
                    <div className="hidden gap-4 rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur-xl lg:flex">
                        <StatMini icon={Users} label="Students" value="32" />
                        <div className="h-10 w-px self-center bg-white/10" />
                        <StatMini
                            icon={BookOpen}
                            label="Subjects"
                            value={subjects.length.toString()}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}


// Sub-components for better organization
function StatMini({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) {
    return (
        <div className="px-4 text-center">
            <div className="mb-1 flex items-center gap-2 text-blue-400">
                <Icon size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
                    {label}
                </span>
            </div>
            <div className="text-xl font-black text-white">{value}</div>
        </div>
    );
}