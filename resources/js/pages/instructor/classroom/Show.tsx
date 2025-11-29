import { useState } from 'react';
import SubjectModal from '@/components/instructor/modal/subject-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectShow({ classroom }) {
    // ⬇ Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingSubject, setEditingSubject] = useState(null);

    // Real subjects from backend: classroom.subjects
    const subjects = classroom.subjects ?? [];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: 'easeOut' },
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
            <Head title="Class Details" />

            <div className="flex flex-col gap-6 p-4">

                {/* CLASS HEADER */}
                <motion.div
                    layoutId="class-card-1"
                    className="relative overflow-hidden rounded-3xl shadow-xl"
                >
                    <motion.div
                        layoutId="class-bg-1"
                        className="h-64 w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('/assets/img/class/39323.jpg')`,
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-transparent p-6 text-white">
                        <motion.div layoutId="class-meta-1">
                            <h3 className="text-lg font-medium">
                                Batch {classroom.batch} – {classroom.shift === 1 ? 'Morning' : 'Evening'} Shift
                            </h3>
                            <h3 className="text-lg opacity-90">Year {classroom.year}</h3>
                        </motion.div>

                        <motion.div
                            layoutId="class-title-1"
                            className="mt-3 max-w-lg"
                        >
                            <h1 className="text-4xl leading-tight font-bold">
                                {classroom.name}
                            </h1>
                            <p className="mt-2 text-sm opacity-80">
                                {classroom.description ?? 'Class description goes here.'}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* SUBJECT LIST */}
                <div>
                    <div className="flex justify-between mt-3">
                        <h1 className="mb-4 text-xl font-semibold">Subjects</h1>

                        {/* ⬇ Open Create Modal */}
                        <Button onClick={openCreateModal}>
                            Create Subject
                        </Button>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {subjects.map((subj) => (
                            <motion.div key={subj.id} variants={cardVariants}>
                                <div className="relative">

                                    {/* CARD LINK */}
                                    <Link
                                        href={route(
                                            'instructor.classes.subjects.index',
                                            subj.id
                                        )}
                                    >
                                        <motion.div
                                            layoutId={`subject-card-${subj.id}`}
                                            className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
                                        >
                                            {/* SUBJECT IMAGE */}
                                            <motion.div
                                                layoutId={`subject-bg-${subj.id}`}
                                                className="h-40 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url('/storage/${subj.cover}')`,
                                                }}
                                            />

                                            {/* CARD CONTENT */}
                                            <Card className="rounded-none border-t-0">
                                                <CardContent className="p-4">
                                                    <motion.div
                                                        layoutId={`subject-meta-${subj.id}`}
                                                    >
                                                        <p className="text-sm text-muted-foreground">
                                                            Semester {subj.semester} – {classroom.year}
                                                        </p>
                                                    </motion.div>

                                                    <motion.h3
                                                        layoutId={`subject-title-${subj.id}`}
                                                        className="mt-1 text-lg font-semibold"
                                                    >
                                                        {subj.name}
                                                    </motion.h3>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Link>

                                    {/* EDIT BUTTON */}
                                    <Button
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openEditModal(subj);
                                        }}
                                    >
                                        Edit
                                    </Button>

                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* SUBJECT MODAL */}
            <SubjectModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                method={modalMode}
                classId={classroom.id}
                defaultValues={
                    editingSubject
                        ? {
                              id: editingSubject.id,
                              name: editingSubject.name,
                              description: editingSubject.description,
                              visibility: editingSubject.visibility,
                          }
                        : undefined
                }
            />
        </AppLayout>
    );
}
