import AppearanceTabsHeader from '@/components/appearance-tabs-header';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Book,
    Calculator,
    FileText,
    GraduationCap,
    PenLine,
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const dots = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 4 + 2,
    }));

    const icons = [
        { Icon: Book, color: 'text-indigo-400', delay: 0 },
        { Icon: PenLine, color: 'text-pink-400', delay: 1.5 },
        { Icon: GraduationCap, color: 'text-teal-400', delay: 3 },
        { Icon: Calculator, color: 'text-blue-400', delay: 4.5 },
        { Icon: FileText, color: 'text-amber-400', delay: 6 },
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            {/* 🔥 FIX: Replace <body> with a div */}
            <div className="font-body min-h-screen bg-white text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="fixed inset-x-0 z-20 flex items-center justify-between bg-white/30 px-6 py-4 shadow-md backdrop-blur-md md:px-12 lg:px-24 dark:bg-gray-900/30">
                    <img
                        className="w-12"
                        src="https://belteigroup.com.kh/images/beltei_international_university_in_cambodia.png"
                        alt="BIU Logo"
                    />
                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <a
                                href="/dashboard"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                            >
                                Dashboard
                            </a>
                        ) : (
                            <>
                                <Link
                                    href={'/login'}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={"/register"}
                                    className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        <AppearanceTabsHeader />
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24">
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05] dark:opacity-[0.08]"></div>

                        {/* Blobs */}
                        <motion.div
                            className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-indigo-300 opacity-30 mix-blend-multiply dark:bg-indigo-700"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-pink-300 opacity-25 mix-blend-multiply dark:bg-pink-700"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ duration: 7, repeat: Infinity }}
                        />

                        {/* Dots */}
                        {dots.map((dot) => (
                            <motion.div
                                key={dot.id}
                                className="absolute rounded-full bg-indigo-400/40 shadow-[0_0_8px_rgba(99,102,241,0.6)] dark:bg-indigo-300/30"
                                style={{
                                    top: `${dot.top}%`,
                                    left: `${dot.left}%`,
                                    width: `${dot.size}px`,
                                    height: `${dot.size}px`,
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [1, 1.5, 1],
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 3,
                                    delay: dot.delay,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}

                        {/* Floating Icons */}
                        {icons.map(({ Icon, color, delay }, i) => (
                            <motion.div
                                key={i}
                                className={`absolute ${color} opacity-40`}
                                style={{
                                    top: `${20 + Math.random() * 60}%`,
                                    left: `${10 + Math.random() * 80}%`,
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0.2, 0.6, 0.2],
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                    duration: 10,
                                    delay,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                <Icon size={32} className="drop-shadow-lg" />
                            </motion.div>
                        ))}

                        {/* Triangles */}
                        <motion.div
                            className="clip-triangle absolute h-24 w-24 bg-pink-400 opacity-20 dark:bg-pink-600"
                            style={{ top: '15%', left: '75%' }}
                            animate={{
                                rotate: [0, 90, 180, 360],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 12, repeat: Infinity }}
                        />
                        <motion.div
                            className="clip-triangle absolute h-32 w-32 bg-indigo-400 opacity-15 dark:bg-indigo-600"
                            style={{ top: '60%', left: '20%' }}
                            animate={{
                                rotate: [360, 270, 180, 0],
                                scale: [1, 1.15, 1],
                            }}
                            transition={{ duration: 15, repeat: Infinity }}
                        />

                        <style>{`
                            .clip-triangle {
                                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                            }
                        `}</style>
                    </div>

                    {/* Main Content */}
                    <motion.div
                        className="z-10 flex max-w-6xl flex-col-reverse items-center gap-8 md:flex-row"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Text */}
                        <motion.div
                            className="flex-1 text-center md:text-left"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            <h1 className="font-heading mb-4 text-4xl font-bold md:text-5xl">
                                Learn, Test, and Achieve — BIU Online Testing
                                System
                            </h1>
                            <p className="font-body mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
                                Welcome to the official online testing system of
                                Beltei International University. Designed
                                exclusively for BIU students, this platform
                                allows you to take quizzes, midterms, and final
                                exams securely — anytime, anywhere.
                            </p>
                            <Link href={'/login'}>
                                <motion.a
                                    // href="/login"
                                    className="inline-block rounded-full bg-[#03b7ce] px-8 py-3 font-semibold text-white shadow transition-all duration-200 hover:bg-indigo-700 dark:bg-[#069dc1] dark:hover:bg-[#038eb1]"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow:
                                            '0 0 20px rgba(3,183,206,0.6)',
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Start now
                                </motion.a>
                            </Link>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            className="relative flex-1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="absolute -inset-4 rotate-12 rounded-full bg-indigo-600 opacity-10 blur-2xl dark:bg-indigo-500 dark:opacity-30"
                                    animate={{
                                        rotate: [12, 18, 12],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                    }}
                                />
                                <img
                                    src="/assets/img/t.png"
                                    alt="BIU Student"
                                    className="relative rounded-2xl"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
            </div>
        </>
    );
}
