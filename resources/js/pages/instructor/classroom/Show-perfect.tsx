import { useState, useCallback, useMemo, memo } from 'react';
import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { Loader2, TrashIcon, Plus, BookOpen } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import SubjectModal from '@/components/instructor/modal/subject-modal';
import CopySubjectModal from './component/copy-subject-modal';
import SubjectCard from '@/components/instructor/card/subject-card'; 
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Memoize Card to prevent grid-wide re-renders
const MemoizedSubjectCard = memo(SubjectCard);

export default function SubjectShow({ classroom, allAvailableClasses = [] }: any) {
    // Single source of truth for UI state
    const [modals, setModals] = useState({ subject: false, copy: false, delete: false });
    const [activeSubject, setActiveSubject] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Optimized Handlers
    const openCreateModal = useCallback(() => {
        setActiveSubject(null);
        setModals(m => ({ ...m, subject: true }));
    }, []);

    const handleEdit = useCallback((subject: any) => {
        setActiveSubject(subject);
        setModals(m => ({ ...m, subject: true }));
    }, []);

    const handleCopy = useCallback((subject: any) => {
        setActiveSubject(subject);
        setModals(m => ({ ...m, copy: true }));
    }, []);

    const handleDeleteClick = useCallback((subject: any) => {
        setActiveSubject(subject);
        setModals(m => ({ ...m, delete: true }));
    }, []);

    const confirmDelete = () => {
        if (!activeSubject) return;
        router.delete(route('instructor.classes.subjects.destroy', [classroom.id, activeSubject.id]), {
            preserveScroll: true,
            onStart: () => setIsProcessing(true),
            onSuccess: () => {
                toast.success('Subject removed');
                setModals(m => ({ ...m, delete: false }));
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Classes', href: route('instructor.classes.index') },
                { title: classroom.name, href: route('instructor.classes.show', classroom.id) },
            ]}
        >
            <Head title={`${classroom.name} | Curriculum`} />

            <div className=" p-6 lg:p-8 lg:px-12">
                {/* HERO SECTION */}
                <motion.div 
                    layoutId={`class-card-${classroom.id}`} 
                    className="relative mb-12 h-72 w-full overflow-hidden rounded-[2rem] shadow-2xl"
                >
                    <motion.div
                        layoutId={`class-bg-${classroom.id}`}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${classroom.cover ? `/storage/${classroom.cover}` : '/assets/img/class/39323.jpg'}')` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                    </motion.div>
                    <div className="relative flex h-full flex-col justify-end p-8 text-white sm:p-12">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl text-primary-foreground font-black tracking-tight sm:text-6xl"
                        >
                            {classroom.name}
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 max-w-2xl text-lg text-slate-200 line-clamp-2"
                        >
                            {classroom.description}
                        </motion.p>
                    </div>
                </motion.div>

                {/* GRID SECTION */}
                <div className="space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
                        <h2 className="text-3xl font-bold tracking-tight">Course Subjects</h2>
                        <Button onClick={openCreateModal} className="h-11 rounded-full px-6 shadow-lg transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-5 w-5" /> Add Subject
                        </Button>
                    </div>

                    <LayoutGroup>
                        <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <AnimatePresence mode="popLayout">
                                {classroom?.subjects?.map((subj: any, idx: number) => (
                                    <motion.div
                                        key={subj.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 300, 
                                            damping: 25,
                                            delay: idx * 0.05 
                                        }}
                                    >
                                        <MemoizedSubjectCard
                                            subject={subj}
                                            classId={classroom.id}
                                            onEdit={handleEdit}
                                            onCopy={handleCopy}
                                            onDelete={handleDeleteClick}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </LayoutGroup>

                    {/* EMPTY STATE */}
                    {(!classroom?.subjects || classroom.subjects.length === 0) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex h-80 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-muted bg-muted/20"
                        >
                            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-xl font-medium text-muted-foreground">No subjects found</p>
                            <Button variant="link" onClick={openCreateModal}>Create your first subject</Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* MODALS */}
            <SubjectModal 
                isOpen={modals.subject} 
                setIsOpen={(v) => setModals(m => ({ ...m, subject: v }))} 
                classId={classroom.id} 
                editingSubject={activeSubject} 
            />
            
            {modals.copy && activeSubject && (
                <CopySubjectModal 
                    isOpen={modals.copy} 
                    setIsOpen={(v) => setModals(m => ({ ...m, copy: v }))} 
                    subjectToCopy={activeSubject} 
                    availableClasses={allAvailableClasses} 
                    sourceClassId={classroom.id} 
                />
            )}

            <AlertDialog open={modals.delete} onOpenChange={(v) => setModals(m => ({ ...m, delete: v }))}>
                <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold">Delete Subject?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove <span className="font-bold text-foreground">{activeSubject?.name}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel disabled={isProcessing} className="rounded-full">Cancel</AlertDialogCancel>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isProcessing} className="rounded-full px-6">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <TrashIcon className="mr-2 h-4 w-4" />}
                            Confirm Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}