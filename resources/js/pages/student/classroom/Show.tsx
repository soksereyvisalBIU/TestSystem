import { ClassroomHeader } from '@/components/cards/classrooms/classroom-header';
import SubjectCardList from '@/components/lists/classrooms/subject-card-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Classrooms', href: '/' }];
// ... existing imports
import ConfirmJoinClassModal from '@/components/student/modal/confim-join-class-modal';
import { Lock, UserPlus } from 'lucide-react'; // Added icons for the "Join" state

export default function SubjectShow({
    classroom,
    isJoined,
}: {
    classroom: any;
    isJoined: boolean;
}) {
    const subjects = classroom?.subjects ?? [];
    const [searchQuery, setSearchQuery] = useState('');
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const filteredSubjects = subjects.filter((s: any) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${classroom.name} | Curriculum`} />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                <ClassroomHeader classroom={classroom} />

                <div className="space-y-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-blue-600" />
                            <h2 className="font-black tracking-tight text-slate-900 uppercase sm:text-xl dark:text-white">
                                Subject Modules
                            </h2>
                        </div>
                        {/* Only show search if joined */}
                        {isJoined && (
                            <div className="flex items-center gap-4">
                                <div className="group relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                                    <input
                                        type="text"
                                        placeholder="Filter curriculum..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 md:w-[300px] dark:border-slate-800 dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- BLUR WRAPPER --- */}
                    <div className="relative">
                        <div
                            className={
                                !isJoined
                                    ? 'pointer-events-none blur-md grayscale-[50%] select-none'
                                    : ''
                            }
                        >
                            <SubjectCardList
                                filteredSubjects={filteredSubjects}
                                classroom={classroom}
                            />

                            {filteredSubjects.length === 0  && (
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

                        {/* --- JOIN OVERLAY --- */}
                        {!isJoined && (
                            <div className="absolute top-0 inset-0 z-10 flex flex-col items-center justify-center rounded-[2.5rem] bg-white/30 text-center backdrop-blur-[2px] dark:bg-slate-950/30">
                                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                                    <Lock className="size-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                    Curriculum Locked
                                </h3>
                                <p className="mt-2 mb-8 max-w-sm text-slate-600 dark:text-slate-400">
                                    Join this classroom to gain full access to
                                    all subject modules, assignments, and
                                    resources.
                                </p>
                                <button
                                    onClick={() => setIsJoinModalOpen(true)}
                                    className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95"
                                >
                                    <UserPlus className="size-5" />
                                    Join Classroom
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmJoinClassModal
                classroomName={classroom.name}
                code={classroom.code}
                isOpen={isJoinModalOpen}
                setIsOpen={setIsJoinModalOpen}
            />
        </AppLayout>
    );
}
