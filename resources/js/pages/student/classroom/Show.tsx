import SubjectModal from '@/components/instructor/modal/subject-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { LayoutGrid, Plus, ArrowLeft } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectShow({ classroom }: { classroom: any }) {

    const page = usePage();

    console.log(page.props)
    
    const subjects = classroom?.subjects ?? [];
    const [openSubjectModal, setOpenSubjectModal] = useState(false);

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // --- Animation ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 18 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.32, ease: 'easeOut' },
        },
    };

    // Open "Create" modal
    const openCreateModal = () => {
        setModalMode('create');
        setEditingSubject(null);
        setIsModalOpen(true);
    };

    // Open "Edit" modal
    const openEditModal = (subject) => {
        setModalMode('edit');
        setEditingSubject(subject);
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${classroom.name} | Details`} />

            <div className="flex flex-col gap-8 p-6">
                {/* Cinematic Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative h-[280px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
                    layoutId={`class-card-${classroom.id}`}
                >
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage: `url('${classroom.cover ? '/storage/' + classroom.cover : '/assets/img/class/39323.jpg'}')`,
                        }}
                    />
                    
                    {/* Multi-layered overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-destructive/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <div className="mb-4 flex items-center gap-3">
                                <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                                    Batch {classroom.batch}
                                </span>
                                <span className="rounded-full bg-blue-500/20 px-4 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                                    {classroom.shift === 1 ? 'Morning' : 'Evening'}
                                </span>
                            </div>
                            <h1 className="text-4xl text-white font-black tracking-tight lg:text-5xl">
                                {classroom.name}
                            </h1>
                            <p className="mt-4 max-w-xl text-lg text-gray-200 opacity-90">
                                {classroom.description || "No description provided for this classroom."}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Subject Section Header */}
                <div className="mt-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <LayoutGrid className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Curriculum</h2>
                        </div>
                        
                        {page.props.auth.can.access_instructor_page && (
                            <Button 
                                onClick={() => setOpenSubjectModal(true)}
                                className="rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        )}
                    </div>

                    {/* Subject Grid with custom animations */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {subjects.map((subj: any) => (
                            <SubjectCardItem key={subj.id} subj={subj} classroomId={classroom.id} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* MODAL */}
            <SubjectModal
                isOpen={openSubjectModal}
                setIsOpen={setOpenSubjectModal}
                mode="create"
                classId={classroom?.id}
            />
        </AppLayout>
    );
}

// Sub-component for a cleaner Subject Card
function SubjectCardItem({ subj, classroomId }: { subj: any, classroomId: number }) {
    const cover = subj.cover ? `/storage/${subj.cover}` : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop';
    
    return (
        <motion.div
            whileHover={{ y: -8 }}
            // transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            layoutId={`subject-card-${subj.id}`}
        >
            <Link href={route('student.classes.subjects.show', [classroomId, subj.id])}>
                <div className="group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-xl">
                    <div 
                        className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${cover}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    <div className="p-5">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {subj.visibility}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                            {subj.name}
                        </h3>
                        <p className="mt-2 flex items-center text-xs font-medium text-primary opacity-0 transition-all group-hover:opacity-100">
                            Explore Curriculum <Plus className="ml-1 h-3 w-3" />
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}