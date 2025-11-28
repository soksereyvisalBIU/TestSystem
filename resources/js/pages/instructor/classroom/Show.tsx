import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Class', href: '/' }];

export default function SubjectShow() {
    const subjects = [
        { id: 1, title: 'Mathematics', img: '/assets/img/class/class.jpg' },
        { id: 2, title: 'Physics', img: '/assets/img/class/class.jpg' },
        { id: 3, title: 'Biology', img: '/assets/img/class/class.jpg' },
        { id: 4, title: 'Computer Science', img: '/assets/img/class/class.jpg' },
    ];

    // Staggered animation for cards
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: 'easeOut' },
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Class Details" />

            <div className="flex flex-col gap-6 p-4">
                {/* CLASS HEADER */}
                <motion.div
                    layoutId="class-card-1"
                    className="relative overflow-hidden rounded-3xl shadow-xl"
                >
                    <motion.div
                        layoutId="class-bg-1"
                        className="h-64 w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('/assets/img/class/39323.jpg')`,
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-transparent p-6 text-white">
                        <motion.div layoutId="class-meta-1">
                            <h3 className="text-lg font-medium">
                                Batch 10 – Morning Shift
                            </h3>
                            <h3 className="text-lg opacity-90">Year 2025</h3>
                        </motion.div>

                        <motion.div
                            layoutId="class-title-1"
                            className="mt-3 max-w-lg"
                        >
                            <h1 className="text-4xl leading-tight font-bold">
                                Computer Science Class
                            </h1>
                            <p className="mt-2 text-sm opacity-80">
                                This is a sample static description for preview
                                purposes.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* SUBJECT LIST */}
                <div>
                    <h1 className="mb-4 text-xl font-semibold">Subjects</h1>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {subjects.map((subj) => (
                            <motion.div key={subj.id} variants={cardVariants}>
                                <Link
                                    href={route(
                                        'instructor.classes.subjects.index',
                                        subj.id,
                                    )}
                                >
                                    <motion.div
                                        layoutId={`subject-card-${subj.id}`}
                                        className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
                                    >
                                        {/* SUBJECT IMAGE */}
                                        <motion.div
                                            layoutId={`subject-bg-${subj.id}`}
                                            className="h-40 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url('${subj.img}')`,
                                            }}
                                        />

                                        {/* CARD CONTENT */}
                                        <Card className="rounded-none border-t-0">
                                            <CardContent className="p-4">
                                                <motion.div
                                                    layoutId={`subject-meta-${subj.id}`}
                                                >
                                                    <p className="text-sm text-muted-foreground">
                                                        Semester 1 – 2025
                                                    </p>
                                                </motion.div>

                                                <motion.h3
                                                    layoutId={`subject-title-${subj.id}`}
                                                    className="mt-1 text-lg font-semibold"
                                                >
                                                    {subj.title}
                                                </motion.h3>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
