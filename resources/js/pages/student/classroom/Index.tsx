import { useMemo, useState, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { BookOpen, Filter, UserPlus } from 'lucide-react';
import { route } from 'ziggy-js';

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
import { type BreadcrumbItem, type ClassroomPagination } from '@/types';

const BREADCRUMBS: BreadcrumbItem[] = [{ title: 'Class', href: '/classrooms' }];

export default function SubjectIndex({
    classrooms,
}: {
    classrooms: ClassroomPagination;
}) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    
    // Use Inertia's usePage to get query params - faster than native window.location access
    const { url } = usePage();
    const showJoinedOnly = useMemo(() => {
        return new URL(url, window.location.origin).searchParams.get('filter') === 'joined';
    }, [url]);

    // Memoize the navigation function to prevent re-creation
    const handleFilterToggle = useCallback(() => {
        const nextFilter = showJoinedOnly ? undefined : 'joined';
        router.get(
            route('classrooms.index'),
            { filter: nextFilter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['classrooms'], // Optimization: Only reload the classrooms data, not the whole page
            },
        );
    }, [showJoinedOnly]);

    const handlePageChange = useCallback((pageUrl: string | null) => {
        if (!pageUrl) return;
        router.get(pageUrl, {}, { 
            preserveScroll: true, 
            preserveState: true,
            only: ['classrooms'] 
        });
    }, []);

    // Optimized Sort & Filter Logic
    const displayedClassrooms = useMemo(() => {
        let items = classrooms.data;
        if (showJoinedOnly) {
            items = items.filter((c) => c.joined);
        }
        // Use a stable sort that only runs when data or filter changes
        return [...items].sort((a, b) => Number(b.joined) - Number(a.joined));
    }, [classrooms.data, showJoinedOnly]);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title="My Classes" />

            {/* Background Aesthetic - transform-gpu for performance */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.03),transparent)] transform-gpu" />

            <div className="container mx-auto space-y-8 p-6 lg:p-10">
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Classrooms</h2>
                        <p className="text-muted-foreground">
                            {showJoinedOnly
                                ? 'Viewing your enrolled learning environments.'
                                : 'Explore available classes and manage your groups.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleFilterToggle}
                            className="rounded-xl transition-colors active:scale-95"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            {showJoinedOnly ? 'Showing Joined' : 'Filter: All'}
                        </Button>

                        <Button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="rounded-xl bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <UserPlus className="mr-2 h-4 w-4" /> Join Class
                        </Button>
                    </div>
                </header>

                {/* Content Grid - Min-height prevents layout jump on filter */}
                <div className="min-h-[400px]">
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
                </div>

                {/* Refined Pagination */}
                {!showJoinedOnly && classrooms.last_page > 1 && (
                    <footer className="mt-12 flex flex-col items-center gap-4 border-t pt-8">
                        <p className="text-center text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                            Page {classrooms.current_page} of {classrooms.last_page}
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
                                    <PaginationItem key={`${link.label}-${i}`} className="hidden sm:inline-block">
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
                    </footer>
                )}
            </div>

            <JoinClassModal isOpen={isJoinModalOpen} setIsOpen={setIsJoinModalOpen} />
        </AppLayout>
    );
}

// Sub-component optimized as a Pure Component
const EmptyState = ({ isFiltering }: { isFiltering: boolean }) => (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-full bg-muted p-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No classrooms found</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {isFiltering
                ? "You haven't joined any classes yet. Try switching to 'All Classes'."
                : 'There are currently no classes available.'}
        </p>
    </div>
);