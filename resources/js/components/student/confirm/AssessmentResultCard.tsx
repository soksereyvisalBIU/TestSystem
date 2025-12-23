import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// Re-use the AnimatedCounter from above
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
    
    // Confetti Effect
    useEffect(() => {
        if (isPassing) {
            const duration = 2500;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#34D399', '#60A5FA']
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#34D399', '#60A5FA']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [isPassing]);

    // Determine decimal places (0 if integer, 1 or 2 if float)
    const isFloat = score % 1 !== 0;
    const decimals = isFloat ? 2 : 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white py-12 text-center shadow-xl ring-1 ring-indigo-100 backdrop-blur-sm dark:from-gray-800 dark:to-gray-900 dark:ring-gray-700">
            {/* Background Decor */}
            <div className={`absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-20 ${isPassing ? 'bg-green-400' : 'bg-red-400'}`} />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400 blur-3xl opacity-20" />

            <div className="relative z-10 flex flex-col items-center">
                <p className="text-sm font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                    Assessment Result
                </p>

                {/* Score Display */}
                <div className="relative mt-6">
                    <div className={`flex items-baseline text-7xl font-black tracking-tighter sm:text-8xl ${isPassing ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600' : 'text-rose-500'}`}>
                        <AnimatedCounter value={score} decimals={decimals} />
                        <span className="text-3xl text-gray-400 ml-1">%</span>
                    </div>
                    <p className="mt-2 text-lg font-medium text-gray-500 dark:text-gray-400">
                        Score: {score} / {maxScore}
                    </p>
                </div>

                {/* Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ring-1 ring-inset ${
                        isPassing
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400"
                    }`}
                >
                    <div className={`h-2 w-2 rounded-full ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {isPassing ? "PASSED" : "NEEDS IMPROVEMENT"}
                </motion.div>

                {completedAt && (
                    <p className="mt-6 text-xs text-gray-400">
                        Submitted {dayjs(completedAt).fromNow()}
                    </p>
                )}
            </div>
        </div>
    );
};