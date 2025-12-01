import SubjectModal from '@/components/instructor/modal/subject-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectShow({ classroom }: { classroom: any }) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Details" />

            <div className="flex flex-col gap-6 p-4">

                {/* ---------------- CLASS HEADER ---------------- */}
                <motion.div
                    layoutId={`class-card-${classroom.id}`}
                    className="relative overflow-hidden rounded-3xl shadow-xl"
                >
                    <motion.div
                        layoutId={`class-bg-${classroom.id}`}
                        className="h-64 w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${
                                classroom.cover
                                    ? '/storage/' + classroom.cover
                                    : '/assets/img/class/default.jpg'
                            }')`,
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-transparent p-6 text-white">
                        <motion.div layoutId={`class-meta-${classroom.id}`}>
                            <h3 className="text-lg font-medium">
                                Batch {classroom.batch} –{' '}
                                {classroom.shift === 1 ? 'Morning' : 'Evening'}
                            </h3>
                            <h3 className="text-lg opacity-90">
                                Year {classroom.year}
                            </h3>
                        </motion.div>

                        <motion.div
                            layoutId={`class-title-${classroom.id}`}
                            className="mt-3 max-w-lg"
                        >
                            <h1 className="text-4xl leading-tight font-bold">
                                {classroom.name}
                            </h1>
                            <p className="mt-2 text-sm opacity-80">
                                {classroom.description}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ---------------- SUBJECT LIST ---------------- */}
                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="mb-4 text-xl font-semibold">Subjects</h1>
                        <Button onClick={() => setOpenSubjectModal(true)}>
                            + Add Subject
                        </Button>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {subjects.length === 0 && (
                            <p className="col-span-full py-8 text-center text-muted-foreground">
                                No subjects added yet.
                            </p>
                        )}

                        {subjects.map((subj: any) => {
                            const cover = subj.cover
                                ? `/storage/${subj.cover}`
                                : '/assets/img/fallback/subject.png';

                            return (
                                <motion.div key={subj.id} variants={cardVariants}>
                                    <Link
                                        href={route(
                                            'instructor.classes.subjects.index',
                                            [classroom.id, subj.id]
                                        )}
                                    >
                                        <motion.div
                                            layoutId={`subject-card-${subj.id}`}
                                            className="cursor-pointer overflow-hidden rounded-2xl  shadow-md transition hover:shadow-xl"
                                        >
                                            {/* Subject Cover */}
                                            <motion.div
                                                layoutId={`subject-bg-${subj.id}`}
                                                className="h-40 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url('${cover}')`,
                                                }}
                                            />

                                            {/* Subject Content */}
                                            <div className="border-t px-4 py-3">
                                                <motion.div
                                                    layoutId={`subject-meta-${subj.id}`}
                                                >
                                                    <p className="text-sm text-muted-foreground">
                                                        {subj.visibility === 'public'
                                                            ? 'Public'
                                                            : 'Private'}
                                                    </p>
                                                </motion.div>

                                                <motion.h3
                                                    layoutId={`subject-title-${subj.id}`}
                                                    className="mt-1 text-lg font-semibold"
                                                >
                                                    {subj.name}
                                                </motion.h3>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
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
