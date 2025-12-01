import ClassCard from '@/components/student/card/class-card';
import ClassModal from '@/components/instructor/modal/class-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

interface ClassroomPagination {
    data: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
        page: number | null;
    }[];
}

export default function SubjectIndex({
    classrooms,
}: {
    classrooms: ClassroomPagination;
}) {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    // Modal State
    const [modalData, setModalData] = useState({
        open: false,
        mode: 'create' as 'create' | 'edit',
        classData: null as any,
    });

    const openCreate = () =>
        setModalData({ open: true, mode: 'create', classData: null });

    const openEdit = (item: any) =>
        setModalData({ open: true, mode: 'edit', classData: item });

    // Flash Toast
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    /** ⛔ No Full Page Refresh Pagination */
    const handlePageChange = (url: string | null) => {
        if (!url) return;

        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true, // Makes browser history cleaner
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <div className="space-y-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-2xl font-bold">Classrooms</h2>
                    {/* <Button onClick={openCreate}>+ Create Class</Button> */}
                    <Button>+ Join Classroom</Button>
                </div>

                {/* Class Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {classrooms.data?.map((classroom) => (
                        <ClassCard
                            key={classroom.id}
                            classroom={classroom}
                            onEdit={() => openEdit(classroom)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination>
                    <PaginationContent>
                        {/* Prev */}
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() =>
                                    handlePageChange(classrooms.links[0]?.url)
                                }
                                className={
                                    !classrooms.links[0]?.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </PaginationItem>

                        {/* Numbered Pages */}
                        {classrooms.links
                            .slice(1, classrooms.links.length - 1)
                            .map((link, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        isActive={link.active}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={
                                            !link.url
                                                ? 'pointer-events-none opacity-50'
                                                : ''
                                        }
                                    />
                                </PaginationItem>
                            ))}

                        {/* Next */}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    handlePageChange(
                                        classrooms.links[
                                            classrooms.links.length - 1
                                        ]?.url
                                    )
                                }
                                className={
                                    !classrooms.links[
                                        classrooms.links.length - 1
                                    ]?.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Modal */}
            <ClassModal
                isOpen={modalData.open}
                mode={modalData.mode}
                classData={modalData.classData}
                setIsOpen={(open) =>
                    setModalData((prev) => ({ ...prev, open }))
                }
            />
        </AppLayout>
    );
}
