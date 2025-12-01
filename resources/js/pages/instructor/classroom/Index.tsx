import ClassCard from '@/components/instructor/card/class-card';
import ClassModal from '@/components/instructor/modal/class-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectIndex({
    classrooms,
}: {
    classrooms: any[];
}) {
    // Flash messages (usePage only for global stuff)
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    // Modal data
    const [modalData, setModalData] = useState({
        open: false,
        mode: 'create' as 'create' | 'edit',
        classData: null as any,
    });

    // Open modal in create mode
    const openCreate = () =>
        setModalData({ open: true, mode: 'create', classData: null });

    // Open modal in edit mode
    const openEdit = (item: any) =>
        setModalData({ open: true, mode: 'edit', classData: item });

    // Show flash messages with Sonner
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-2xl font-bold">Classes</h2>
                    <Button onClick={openCreate}>+ Create Class</Button>
                </div>

                {/* Class Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    
                    {classrooms.map((classroom) => (
                        <ClassCard
                            key={classroom.id}
                            classroom={classroom}
                            onEdit={() => openEdit(classroom)}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            <ClassModal
                isOpen={modalData.open}
                mode={modalData.mode}
                classData={modalData.classData}
                setIsOpen={(open) =>
                    setModalData((m) => ({ ...m, open }))
                }
            />
        </AppLayout>
    );
}
