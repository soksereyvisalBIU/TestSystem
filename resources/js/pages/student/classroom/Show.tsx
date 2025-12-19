import SubjectModal from '@/components/instructor/modal/subject-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { sub } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    Clock,
    Edit3,
    Lock,
    Search,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Classrooms', href: '/' }];

export default function SubjectShow({ classroom }: { classroom: any }) {
    const page = usePage();
    const subjects = classroom?.subjects ?? [];
    const [openSubjectModal, setOpenSubjectModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Filtered subjects logic
    const filteredSubjects = subjects.filter((s: any) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${classroom.name} | Curriculum`} />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                {/* --- 1. CINEMATIC HEADER --- */}
                <motion.div
                    layoutId={`class-card-${classroom.id}`}
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
                                <StatMini
                                    icon={Users}
                                    label="Students"
                                    value="32"
                                />
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

                {/* --- 2. CONTROLS BAR --- */}
                {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Filter curriculum..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-[300px] dark:bg-slate-900 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    {page.props.auth.can.access_instructor_page && (
                        <Button 
                            onClick={() => setOpenSubjectModal(true)}
                            className="rounded-2xl bg-blue-600 h-11 px-6 font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 size-4 stroke-[3px]" /> Add Subject
                        </Button>
                    )}
                </div> */}

                {/* --- 3. SUBJECT GRID --- */}
                <div className="space-y-6">
                    <div className='flex justify-between'>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-blue-600" />
                            <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                Subject Modules
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="group relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                                <input
                                    type="text"
                                    placeholder="Filter curriculum..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 md:w-[300px] dark:border-slate-800 dark:bg-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredSubjects.map((subj: any) => (
                                <SubjectCard
                                    key={subj.id}
                                    subj={subj}
                                    classroomId={classroom.id}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredSubjects.length === 0 && (
                        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
                            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                <BookOpen />
                            </div>
                            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                                No matching subjects found
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <SubjectModal
                isOpen={openSubjectModal}
                setIsOpen={setOpenSubjectModal}
                mode="create"
                classId={classroom?.id}
            />
        </AppLayout>
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

function SubjectCard({
    subj,
    classroomId,
}: {
    subj: any;
    classroomId: number;
}) {
    const isPrivate = subj.visibility === 'private';

    return (
        <motion.div
            layout
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -5 }}
            layoutId={`subject-card-${subj.id}`}
            className="group relative"
        >
            <Link
                href={route('student.classes.subjects.show', [
                    classroomId,
                    subj.id,
                ])}
            >
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-[#09090b]">
                    {/* Cover Image with Glass Tag */}
                    <div className="relative h-44 w-full overflow-hidden">
                        <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: `url('${subj.cover ? '/storage/' + subj.cover : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {isPrivate && (
                            <div className="absolute top-4 left-4 rounded-lg border border-white/20 bg-black/60 p-1.5 text-white backdrop-blur-md">
                                <Lock size={12} strokeWidth={3} />
                            </div>
                        )}

                        <div className="absolute bottom-4 left-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-white uppercase">
                                View Module <ArrowRight size={12} />
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-2 flex items-start justify-between">
                            <span className="text-[9px] font-black tracking-[0.2em] text-blue-500 uppercase">
                                {subj.code || 'IT-MOD'}
                            </span>
                        </div>
                        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg leading-tight font-black text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                            {subj.name}
                        </h3>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-400 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span className="text-xs font-bold">
                                    12 Lectures
                                </span>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
                                <Edit3 size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
