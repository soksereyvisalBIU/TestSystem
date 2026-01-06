import ClassModal from '@/components/instructor/modal/class-modal';
// import ClassCard from '@/components/student/card/class-card';
import ClassCard from '@/components/cards/classrooms/classroom-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
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
import { UserPlus } from 'lucide-react';

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
    // const { flash } = usePage().props as {
    //     flash?: { success?: string; error?: string };
    // };

    // // Modal State
    // const [modalData, setModalData] = useState({
    //     open: false,
    //     mode: 'create' as 'create' | 'edit',
    //     classData: null as any,
    // });

    // const openCreate = () =>
    //     setModalData({ open: true, mode: 'create', classData: null });

    // const openEdit = (item: any) =>
    //     setModalData({ open: true, mode: 'edit', classData: item });

    // Flash Toast
    // useEffect(() => {
    //     if (flash?.success) toast.success(flash.success);
    //     if (flash?.error) toast.error(flash.error);
    // }, [flash]);

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
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classes" />

            <Head title="Classes" />

            {/* Subtle Background Decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.03),transparent)]" />

            <div className="space-y-8 p-6 lg:p-10">
                {/* Refined Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Classrooms
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your learning environments and student
                            groups.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            // variant="outline"
                            size={'lg'}
                            className="rounded-full shadow-sm"
                        >
                            <UserPlus className="mr-2 h-4 w-4" /> Join Class
                        </Button>
                        {/* Instructor only button could go here */}
                    </div>
                </div>

                {/* Grid with better spacing */}
                <div className="grid gap-5 xs:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {classrooms.data?.map((classroom) => (
                        <ClassCard
                            key={classroom.id}
                            classroom={classroom}
                            onEdit={() => openEdit(classroom)}
                        />
                    ))}
                </div>

                {/* Elegant Pagination */}
                <div className="mt-10 flex justify-center border-t pt-8">
                    <Pagination>
                        <PaginationContent className="rounded-full border bg-background/50 p-1 backdrop-blur-sm">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageChange(
                                            classrooms.links[0]?.url,
                                        )
                                    }
                                    className={
                                        !classrooms.links[0]?.url
                                            ? 'opacity-30'
                                            : 'cursor-pointer hover:bg-accent'
                                    }
                                />
                            </PaginationItem>

                            {classrooms.links.slice(1, -1).map((link, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() =>
                                            handlePageChange(link.url)
                                        }
                                        isActive={link.active}
                                        className="cursor-pointer rounded-full"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageChange(
                                            classrooms.links[
                                                classrooms.links.length - 1
                                            ]?.url,
                                        )
                                    }
                                    className={
                                        !classrooms.links[
                                            classrooms.links.length - 1
                                        ]?.url
                                            ? 'opacity-30'
                                            : 'cursor-pointer hover:bg-accent'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            {/* Modal */}
            {/* <ClassModal
                isOpen={modalData.open}
                mode={modalData.mode}
                classData={modalData.classData}
                setIsOpen={(open) =>
                    setModalData((prev) => ({ ...prev, open }))
                }
            /> */}
        </AppLayout>
    );
}
