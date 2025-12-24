import { useCallback, useEffect, useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Search, Plus, School, SlidersHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import ClassCard from '@/components/instructor/card/class-card';
import ClassModal from '@/components/instructor/modal/class-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { route } from 'ziggy-js';

export default function SubjectIndex({ classrooms: initialClassrooms = [] }: { classrooms: any[] }) {
    const { flash } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [modalData, setModalData] = useState({ open: false, classData: null });

    // 1. Sync with TanStack Query
    const { data: classrooms, isFetching } = useQuery({
        queryKey: ['instructor-classes'],
        queryFn: async () => {
            const response = await axios.get(route('instructor.classes.index'));
            // Ensure we handle both Laravel's direct array or a data wrapper
            return Array.isArray(response.data) ? response.data : response.data.classrooms;
        },
        initialData: initialClassrooms,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // 2. Filter using the reactive 'classrooms' variable
    const filteredClassrooms = useMemo(() => {
        return (classrooms || []).filter((item: any) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [classrooms, searchQuery]);

    const openCreate = useCallback(() => setModalData({ open: true, classData: null }), []);
    const openEdit = useCallback((item: any) => setModalData({ open: true, classData: item }), []);

    return (
        <AppLayout breadcrumbs={[{ title: 'Class', href: '/instructor/classes' }]}>
            <Head title="Classes" />

            <div className="space-y-8 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Classes</h2>
                            {isFetching && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                        </div>
                        <p className="text-muted-foreground font-medium">Elevate your teaching experience.</p>
                    </div>
                    <Button 
                        onClick={openCreate} 
                        className="h-12 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                    >
                        <Plus className="mr-2 h-5 w-5" /> <span className="font-bold">New Classroom</span>
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Find a class..."
                            className="pl-10 h-11 bg-background/50 border-slate-200 dark:border-slate-800 rounded-xl focus-visible:ring-offset-0 focus-visible:ring-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <motion.div layout className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredClassrooms.map((classroom: any) => (
                            <motion.div
                                key={classroom.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ClassCard classroom={classroom} onEdit={openEdit} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredClassrooms.length === 0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                        <School className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-xl font-bold">No results found</h3>
                        <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                    </div>
                )}
            </div>

            <ClassModal
                isOpen={modalData.open}
                classData={modalData.classData}
                setIsOpen={(open) => setModalData((m) => ({ ...m, open }))}
            />
        </AppLayout>
    );
}