import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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
    useEffect(() => {
        if (!isPassing) return;

        const isExcellent = score >= 90;
        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#34D399', '#60A5FA', '#A78BFA', '#FBBF24'];

        /* ------------------------------
           1️⃣ Layered Side + Center Bursts
        --------------------------------*/
        const layeredBurst = () => {
            confetti({
                particleCount: 6,
                angle: 60,
                spread: 70,
                startVelocity: 60,
                origin: { x: 0, y: 1 },
                colors,
            });

            confetti({
                particleCount: 6,
                angle: 120,
                spread: 70,
                startVelocity: 60,
                origin: { x: 1, y: 1 },
                colors,
            });

            // confetti({
            //     particleCount: 4,
            //     spread: 120,
            //     startVelocity: 28,
            //     origin: { x: 0.5, y: 0.5 },
            //     colors,
            // });
        };

        /* ------------------------------
           2️⃣ Elegant Falling Confetti
        --------------------------------*/
        // const fallingConfetti = () => {
        //     confetti({
        //         particleCount: 140,
        //         angle: 90,
        //         spread: 100,
        //         startVelocity: 28,
        //         gravity: 0.6,
        //         ticks: 300,
        //         origin: { x: 0.5, y: -0.1 },
        //         colors,
        //     });
        // };

        /* ------------------------------
           3️⃣ Fireworks Pops (Excellent)
        --------------------------------*/
        const fireworks = () => {
            confetti({
                particleCount: 90,
                spread: 360,
                startVelocity: 45,
                decay: 0.9,
                scalar: 1.1,
                colors,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5,
                },
            });
        };

        /* ------------------------------
           Animation Frame Loop
        --------------------------------*/
        const frame = () => {
            layeredBurst();

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        // Run animations
        layeredBurst();
        // fallingConfetti();

        // if (isExcellent) {
        setTimeout(fireworks, 400);
        setTimeout(fireworks, 800);
        setTimeout(fireworks, 1200);
        // }

        frame();
    }, [isPassing, score]);

    /* ------------------------------
       Score Formatting
    --------------------------------*/
    const isFloat = score % 1 !== 0;
    const decimals = isFloat ? 2 : 0;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white py-12 text-center shadow-xl ring-1 ring-indigo-100 backdrop-blur-sm dark:from-gray-800 dark:to-gray-900 dark:ring-gray-700">
            {/* Background Glow */}
            <div
                className={`absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl ${
                    isPassing ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
            />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">
                <p className="text-sm font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
                    Assessment Result
                </p>

                {/* Score */}
                <div className="relative mt-6">
                    <div
                        className={`flex items-baseline text-7xl font-black tracking-tighter sm:text-8xl ${
                            isPassing
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent'
                                : 'text-rose-500'
                        }`}
                    >
                        <AnimatedCounter value={score} decimals={decimals} />
                        <span className="ml-1 text-3xl text-gray-400">%</span>
                    </div>

                    <p className="mt-2 text-lg font-medium text-gray-500 dark:text-gray-400">
                        Score: {score} / {maxScore}
                    </p>
                </div>

                {/* Result Badge */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ring-1 ring-inset ${
                        isPassing
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${
                            isPassing ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                    />
                    {isPassing ? 'PASSED' : 'NEEDS IMPROVEMENT'}
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
