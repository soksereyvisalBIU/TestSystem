import { useMemo, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { BookOpen, Search, Lock, UserPlus } from 'lucide-react';

import { ClassroomHeader } from '@/components/cards/classrooms/classroom-header';
import SubjectCardList from '@/components/lists/classrooms/subject-card-list';
import AppLayout from '@/layouts/app-layout';
import ConfirmJoinClassModal from '@/components/student/modal/confim-join-class-modal';
import { type BreadcrumbItem } from '@/types';

const BREADCRUMBS: BreadcrumbItem[] = [{ title: 'Classrooms', href: '/' }];

export default function SubjectShow({
    classroom,
    isJoined,
}: {
    classroom: any;
    isJoined: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    // 1. Memoize filtered list to prevent O(n) operation on every render
    const filteredSubjects = useMemo(() => {
        const subjects = classroom?.subjects ?? [];
        if (!searchQuery.trim()) return subjects;
        
        const query = searchQuery.toLowerCase();
        return subjects.filter((s: any) => 
            s.name.toLowerCase().includes(query)
        );
    }, [classroom?.subjects, searchQuery]);

    // 2. Memoize the toggle to prevent child re-renders
    const toggleJoinModal = useCallback((state: boolean) => {
        setIsJoinModalOpen(state);
    }, []);

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`${classroom.name} | Curriculum`} />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Header is static, doesn't need frequent updates */}
                <ClassroomHeader classroom={classroom} />

                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                            <h2 className="font-black tracking-tight text-slate-900 uppercase sm:text-xl dark:text-white">
                                Subject Modules
                            </h2>
                        </div>

                        {/* Search Optimization: Only mount if joined to save DOM weight */}
                        {isJoined && (
                            <div className="group relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                                <input
                                    type="text"
                                    placeholder="Filter curriculum..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-[300px] dark:border-slate-800 dark:bg-slate-900"
                                />
                            </div>
                        )}
                    </div>

                    {/* --- Content Area with GPU-Accelerated Blur --- */}
                    <div className="relative min-h-[400px]">
                        <div
                            className={`transition-all duration-700 ease-in-out transform-gpu ${
                                !isJoined 
                                ? 'pointer-events-none blur-xl grayscale opacity-40 select-none will-change-[filter]' 
                                : 'opacity-100'
                            }`}
                        >
                            <SubjectCardList
                                filteredSubjects={filteredSubjects}
                                classroom={classroom}
                            />

                            {filteredSubjects.length === 0 && (
                                <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
                                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                        <BookOpen />
                                    </div>
                                    <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                                        No matching subjects found
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* --- Optimized Join Overlay --- */}
                        {!isJoined && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[2.5rem] bg-white/10 text-center dark:bg-slate-950/10">
                                <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                                    <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/40 transform-gpu hover:scale-110 transition-transform">
                                        <Lock className="size-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Curriculum Locked
                                    </h3>
                                    <p className="mt-3 mb-10 max-w-sm px-6 text-base font-medium text-slate-600 dark:text-slate-400">
                                        Join this classroom to unlock subject modules, assignments, and exclusive resources.
                                    </p>
                                    <button
                                        onClick={() => toggleJoinModal(true)}
                                        className="group flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
                                    >
                                        <UserPlus className="size-5 transition-transform group-hover:rotate-12" />
                                        Join Classroom
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmJoinClassModal
                classroomName={classroom.name}
                code={classroom.code}
                isOpen={isJoinModalOpen}
                setIsOpen={toggleJoinModal}
            />
        </AppLayout>
    );
}