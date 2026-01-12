import ClassCard from '@/components/cards/classrooms/classroom-card';
import JoinClassModal from '@/components/student/modal/join-class-modal';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClassroomPagination } from '@/types'; // Assumed type location
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, UserPlus, Filter, LayoutGrid } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/classrooms' }];

export default function SubjectIndex({ classrooms }: { classrooms: ClassroomPagination }) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    
    // Use URL search params for filtering to keep state on refresh
    const { url } = usePage();
    const showJoinedOnly = new URLSearchParams(window.location.search).get('filter') === 'joined';

    const handleFilterToggle = () => {
        const nextFilter = showJoinedOnly ? undefined : 'joined';
        router.get(route('classrooms.index'), { filter: nextFilter }, { 
            preserveState: true, 
            preserveScroll: true 
        });
    };

    const handlePageChange = (url: string | null) => {
        if (url) router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    // Memoize sorted data to prevent unnecessary re-renders
    const displayedClassrooms = useMemo(() => {
        let items = [...classrooms.data];
        if (showJoinedOnly) {
            items = items.filter((c) => c.joined);
        }
        return items.sort((a, b) => Number(b.joined) - Number(a.joined));
    }, [classrooms.data, showJoinedOnly]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Classes" />

            {/* Background Aesthetic */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.03),transparent)]" />

            <div className="container mx-auto space-y-8 p-6 lg:p-10">
                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Classrooms</h2>
                        <p className="text-muted-foreground">
                            {showJoinedOnly 
                                ? "Viewing your enrolled learning environments." 
                                : "Explore available classes and manage your groups."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleFilterToggle}
                            className="rounded-xl"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showJoinedOnly ? 'Showing Joined' : 'Filter: All'}
                        </Button>
                        
                        <Button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            <UserPlus className="mr-2 h-4 w-4" /> Join Class
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                {displayedClassrooms.length > 0 ? (
                    <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedClassrooms.map((classroom) => (
                            <ClassCard
                                key={classroom.id}
                                classroom={classroom}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState isFiltering={showJoinedOnly} />
                )}

                {/* Refined Pagination */}
                {!showJoinedOnly && classrooms.last_page > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-4 border-t pt-8">
                         <p className="text-xs text-muted-foreground text-center">
                            Showing page {classrooms.current_page} of {classrooms.last_page}
                        </p>
                        <Pagination>
                            <PaginationContent className="rounded-xl border bg-background/50 p-1 backdrop-blur-sm">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(classrooms.links[0]?.url)}
                                        className={!classrooms.links[0]?.url ? 'pointer-events-none opacity-30' : 'cursor-pointer'}
                                    />
                                </PaginationItem>

                                {classrooms.links.slice(1, -1).map((link, i) => (
                                    <PaginationItem key={i} className="hidden sm:inline-block">
                                        <PaginationLink
                                            onClick={() => handlePageChange(link.url)}
                                            isActive={link.active}
                                            className="cursor-pointer rounded-lg"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(classrooms.links[classrooms.links.length - 1]?.url)}
                                        className={!classrooms.links[classrooms.links.length - 1]?.url ? 'pointer-events-none opacity-30' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            <JoinClassModal isOpen={isJoinModalOpen} setIsOpen={setIsJoinModalOpen} />
        </AppLayout>
    );
}

// Sub-component for Empty State
function EmptyState({ isFiltering }: { isFiltering: boolean }) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
            <div className="rounded-full bg-muted p-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No classrooms found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {isFiltering 
                    ? "You haven't joined any classes yet. Try switching to 'All Classes' to see what's available."
                    : "There are currently no classes available for your account."}
            </p>
        </div>
    );
}