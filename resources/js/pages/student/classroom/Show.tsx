import { ClassroomHeader } from '@/components/cards/classrooms/classroom-header';
import SubjectModal from '@/components/instructor/modal/subject-modal';
import SubjectCardList from '@/components/lists/classrooms/subject-card-list';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Classrooms', href: '/' }];

export default function SubjectShow({ classroom }: { classroom: any }) {
    const subjects = classroom?.subjects ?? [];
    const [openSubjectModal, setOpenSubjectModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // const { flash } = usePage().props as {
    //     flash?: { success?: string; error?: string };
    // };

    // useEffect(() => {
    //     if (flash?.success) toast.success(flash.success);
    //     if (flash?.error) toast.error(flash.error);
    // }, [flash]);

    // Filtered subjects logic
    const filteredSubjects = subjects.filter((s: any) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${classroom.name} | Curriculum`} />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8">
                {/* --- 1. CINEMATIC HEADER --- */}
                <ClassroomHeader classroom={classroom} />

                {/* --- 2. CONTROLS BAR --- */}
                {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Filter curriculum..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-[300px] dark:bg-slate-900 dark:border-slate-800"
                            />
                        </div>
                    </div>

                    {page.props.auth.can.access_instructor_page && (
                        <Button 
                            onClick={() => setOpenSubjectModal(true)}
                            className="rounded-2xl bg-blue-600 h-11 px-6 font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 size-4 stroke-[3px]" /> Add Subject
                        </Button>
                    )}
                </div> */}

                {/* --- 3. SUBJECT GRID --- */}
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-blue-600" />
                            <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                Subject Modules
                            </h2>
                        </div>
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
                    </div>

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
            </div>

            <SubjectModal
                isOpen={openSubjectModal}
                setIsOpen={setOpenSubjectModal}
                mode="create"
                classId={classroom?.id}
            />
        </AppLayout>
    );
}
