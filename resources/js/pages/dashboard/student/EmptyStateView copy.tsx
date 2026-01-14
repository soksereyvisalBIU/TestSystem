import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Plus, Rocket, Target, Zap } from 'lucide-react';
import OnboardingCard from './OnboardingCard';
export default function EmptyStateView({itemVariants , levelInfo , greeting , student}) {
    return (
        <div className="container mx-auto p-6">
            <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                            System Online • Level {levelInfo.currentLevel}
                        </span>
                    </div>
                </div>
                <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 md:text-7xl">
                    {greeting},{' '}
                    <span className="text-primary italic">
                        {student.name.split(' ')[0]}
                    </span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-8 py-10 md:grid-cols-2"
            >
                <div className="relative flex min-h-[500px] flex-col items-start justify-between overflow-hidden rounded-[4rem] bg-slate-950 p-12 text-white md:p-16">
                    <Rocket className="absolute -right-10 -bottom-10 h-80 w-80 -rotate-12 text-primary/10" />
                    <div className="relative z-10 space-y-8">
                        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary shadow-2xl shadow-primary/40">
                            <Plus size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-6xl leading-[0.9] font-[1000] tracking-tighter text-primary">
                            Ready to <br /> Launch?
                        </h2>
                        <p className="max-w-xs text-lg leading-relaxed font-medium text-slate-400">
                            Join your first classroom to access personalized
                            subjects, track your GPA, and unlock your scholar
                            roadmap.
                        </p>
                        <Link
                            href="/student/classes"
                            className="group inline-flex items-center gap-4 rounded-[2rem] bg-white px-10 py-5 font-black text-slate-950 transition-all hover:bg-primary hover:text-white"
                        >
                            Browse Classrooms{' '}
                            <ArrowRight
                                size={22}
                                className="transition-transform group-hover:translate-x-2"
                            />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <OnboardingCard
                        icon={Compass}
                        title="Explore Curriculum"
                        desc="Join classes to sync your subjects with the latest 2026 semester requirements."
                        color="text-indigo-500"
                        bg="bg-indigo-500/10"
                    />
                    <OnboardingCard
                        icon={Target}
                        title="Track Performance"
                        desc="Real-time analytics will appear here as you complete assessments and quizzes."
                        color="text-emerald-500"
                        bg="bg-emerald-500/10"
                    />
                    <OnboardingCard
                        icon={Zap}
                        title="Live Missions"
                        desc="Get instant notifications for time-sensitive exams and homework assignments."
                        color="text-amber-500"
                        bg="bg-amber-500/10"
                    />
                </div>
            </motion.div>
        </div>
    );
}
