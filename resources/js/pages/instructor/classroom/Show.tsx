import SubjectModal from '@/components/instructor/modal/subject-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react'; // Added useMemo for availableClasses simulation
import { toast } from 'sonner';
import { route } from 'ziggy-js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react';
// import CopySubjectModal from '@/components/instructor/modal/copy-subject-modal';
import CopySubjectModal from './component/copy-subject-modal';
// NOTE: Assuming this file exists and handles the confirmation
// import DeleteConfirmationModal from '@/components/ui/delete-confirmation-modal'; 

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Classes', href: route('instructor.classes.index') }];

// Define a type for the Subject structure for clarity
interface Subject {
    id: number;
    name: string;
    cover: string | null;
    visibility: 'public' | 'private';
    // Add other subject properties as needed
}

// Define a type for the Classroom structure
interface Classroom {
    id: number;
    name: string;
    description: string;
    batch: number;
    shift: 1 | 2; // 1 for Morning, 2 for Evening
    year: number;
    cover: string | null;
    subjects: Subject[];
    // Add other classroom properties as needed
}

// Define the type for available classes for the CopySubjectModal
interface AvailableClass {
    id: number;
    name: string;
}

export default function SubjectShow({ 
    classroom,
    // You should pass all other classes available to the instructor as a prop
    allAvailableClasses 
}: { 
    classroom: Classroom;
    allAvailableClasses: AvailableClass[]; // Example prop
}) {
    const subjects = classroom?.subjects ?? [];
    
    // State for the SubjectModal (Create/Edit)
    const [openSubjectModal, setOpenSubjectModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    // State for the CopySubjectModal
    const [openCopyModal, setOpenCopyModal] = useState(false);
    const [subjectToCopy, setSubjectToCopy] = useState<Subject | null>(null);

    // State for the Delete Confirmation Modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
    const [isDeleting, setIsDeleting] = useState(false); // To handle loading state on delete

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };
    
    // Use the actual prop, but keep the name consistent with the modal's expected type
    const availableClasses = allAvailableClasses; 
    
    // --- Toast Notifications Effect ---
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // --- Animation Variants ---
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

    // --- Modal Handlers ---
    
    // Open "Create" modal
    const openCreateModal = () => {
        setModalMode('create');
        setEditingSubject(null);
        setOpenSubjectModal(true);
    };

    // Open "Edit" modal
    const openEditModal = (subject: Subject) => {
        setModalMode('edit');
        setEditingSubject(subject);
        setOpenSubjectModal(true);
    };

    // Open "Copy" modal
    const openCopySubjectModal = (subject: Subject) => {
        setSubjectToCopy(subject);
        setOpenCopyModal(true);
    };
    
    // Open "Delete" modal
    const openDeleteSubjectModal = (subject: Subject) => {
        setSubjectToDelete(subject);
        setOpenDeleteModal(true);
    };
    
    // Handle actual deletion
    const handleDeleteSubject = () => {
        if (subjectToDelete) {
            setIsDeleting(true);
            router.delete(
                route('instructor.classes.subjects.destroy', [
                    classroom.id,
                    subjectToDelete.id,
                ]), 
                {
                    preserveScroll: true,
                    onStart: () => setIsDeleting(true),
                    onSuccess: () => {
                        toast.success('Subject deleted successfully.');
                        setOpenDeleteModal(false);
                        setSubjectToDelete(null);
                    },
                    onError: (errors) => {
                        // Display the first error message if available
                        const errorMessage = Object.values(errors).flat()[0] || 'Failed to delete subject.';
                        toast.error(errorMessage);
                    },
                    onFinish: () => setIsDeleting(false),
                }
            );
        }
    };
    
    return (
        <AppLayout 
            breadcrumbs={[
                ...breadcrumbs, 
                { title: classroom.name, href: route('instructor.classes.show', classroom.id) }
            ]}
        >
            <Head title={`Class: ${classroom.name}`} />

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
                                    : '/assets/img/class/39323.jpg'
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
                        <Button onClick={openCreateModal}>
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

                        {subjects.map((subj: Subject) => {
                            const cover = subj.cover
                                ? `/storage/${subj.cover}`
                                : '/assets/img/fallback/subject.png';

                            return (
                                <motion.div
                                    key={subj.id}
                                    variants={cardVariants}
                                    className="group relative"
                                >
                                    {/* Action Button */}
                                    <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                                        <SubjectActions
                                            subject={subj}
                                            classId={classroom.id}
                                            openEditModal={openEditModal}
                                            openCopyModal={openCopySubjectModal}
                                            openDeleteModal={openDeleteSubjectModal}
                                        />
                                    </div>
                                    
                                    <Link
                                        href={route(
                                            'instructor.classes.subjects.show',
                                            [classroom.id, subj.id],
                                        )}
                                    >
                                        <motion.div
                                            layoutId={`subject-card-${subj.id}`}
                                            className="cursor-pointer overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl"
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
                                                        {subj.visibility ===
                                                        'public'
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

            {/* MODAL (Create and Edit use the same modal with different props) */}
            <SubjectModal
                isOpen={openSubjectModal}
                setIsOpen={setOpenSubjectModal}
                mode={modalMode}
                classId={classroom.id}
                editingSubject={editingSubject} // Pass the subject data if mode is 'edit'
            />
            
            {/* Copy Subject Modal */}
            {subjectToCopy && (
                <CopySubjectModal
                    isOpen={openCopyModal}
                    setIsOpen={setOpenCopyModal}
                    subjectToCopy={subjectToCopy}
                    availableClasses={availableClasses} // Pass available classes
                    sourceClassId={classroom.id}
                /> 
            )}
            
            {/* Delete Confirmation Modal */}
            {/* {subjectToDelete && (
                <DeleteConfirmationModal
                    isOpen={openDeleteModal}
                    setIsOpen={setOpenDeleteModal}
                    title="Delete Subject"
                    description={`Are you sure you want to delete the subject: "${subjectToDelete.name}"? This action cannot be undone and will remove all associated content.`}
                    onConfirm={handleDeleteSubject}
                    isProcessing={isDeleting}
                />
            )} */}
        </AppLayout>
    );
}

// --- Subject ACTIONS Component ---
function SubjectActions({
    subject,
    classId, // Not directly used here but useful context
    openEditModal,
    openCopyModal,
    openDeleteModal,
}: {
    subject: Subject;
    classId: number;
    openEditModal: (subject: Subject) => void;
    openCopyModal: (subject: Subject) => void;
    openDeleteModal: (subject: Subject) => void;
}) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white hover:text-white/80 bg-black/40 hover:bg-black/60 transition"
                        aria-label="Subject Actions"
                        onClick={(e) => e.preventDefault()} // Prevent link click when opening dropdown
                    >
                        <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigating the link
                            openEditModal(subject);
                        }}
                    >
                        <PencilIcon className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigating the link
                            openCopyModal(subject);
                        }}
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy to...
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigating the link
                            openDeleteModal(subject);
                        }}
                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}