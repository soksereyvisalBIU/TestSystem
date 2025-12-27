import { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { CheckCircle2, XCircle, Award, Calendar } from "lucide-react";
import { AnimatedCounter } from './AnimatedCounter';

export const AssessmentResultCard = ({
    score,
    maxScore,
    isPassing,
    completedAt,
}: {
    score: number;
    maxScore: number;
    isPassing: boolean;
    completedAt?: string;
}) => {
    // 1. Grand Finale Confetti
    useEffect(() => {
        if (isPassing) {
            const end = Date.now() + 3000;
            const colors = ['#10B981', '#3B82F6', '#6366F1'];

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.7 },
                    colors: colors
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 },
                    colors: colors
                });

                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }, [isPassing]);

    const isFloat = score % 1 !== 0;
    const decimals = isFloat ? 1 : 0;
    
    // SVG Circle Math
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    // Staggered Animation Variants
    const container = {
        hidden: { opacity: 0, scale: 0.9 },
        show: {
            opacity: 1,
            scale: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
            {/* 2. Dynamic Background Glows */}
            <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[100px] transition-colors duration-1000 ${isPassing ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-[100px] bg-blue-500/10" />

            <div className="relative z-10 flex flex-col items-center">
                <motion.div variants={item} className="flex items-center gap-2 mb-6">
                    <Award className={`h-5 w-5 ${isPassing ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                        Final Performance
                    </span>
                </motion.div>

                {/* 3. Radial Progress Ring */}
                <motion.div variants={item} className="relative flex items-center justify-center">
                    <svg className="h-48 w-48 rotate-[-90deg] sm:h-56 sm:w-56">
                        {/* Background Track */}
                        <circle
                            cx="50%" cy="50%" r={radius}
                            className="stroke-gray-100 dark:stroke-gray-800 fill-none"
                            strokeWidth="12"
                        />
                        {/* Animated Progress Path */}
                        <motion.circle
                            cx="50%" cy="50%" r={radius}
                            className={`fill-none ${isPassing ? 'stroke-emerald-500' : 'stroke-rose-500'}`}
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            strokeLinecap="round"
                        />
                    </svg>
                    
                    {/* Centered Score */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`flex items-baseline text-5xl font-black tracking-tighter sm:text-6xl ${isPassing ? 'text-gray-900 dark:text-white' : 'text-rose-600'}`}>
                            <AnimatedCounter value={score} decimals={decimals} />
                            <span className="text-xl text-gray-400 ml-0.5">%</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Verdict Badge */}
                <motion.div
                    variants={item}
                    className={`mt-8 inline-flex items-center gap-2 rounded-2xl px-6 py-3 transition-all ${
                        isPassing
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                >
                    {isPassing ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    <span className="text-sm font-bold tracking-wide">
                        {isPassing ? "Successfully Passed" : "Attempt Completed"}
                    </span>
                </motion.div>

                {/* 5. Contextual Footer */}
                <motion.div 
                    variants={item}
                    className="mt-8 flex flex-col items-center gap-2 border-t border-gray-50 dark:border-gray-800 pt-6 w-full"
                >
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400 text-center">Points</span>
                            <span className="text-gray-900 dark:text-white font-bold">{score}/{maxScore}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-100 dark:bg-gray-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400 text-center">Status</span>
                            <span className={isPassing ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                                {isPassing ? 'Certified' : 'Incomplete'}
                            </span>
                        </div>
                    </div>

                    {completedAt && (
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-medium text-gray-400">
                            <Calendar size={12} />
                            <span>Submitted {dayjs(completedAt).format('MMMM D, YYYY [at] h:mm A')}</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};