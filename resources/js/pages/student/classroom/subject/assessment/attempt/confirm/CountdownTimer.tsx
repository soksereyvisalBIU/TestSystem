import dayjs from 'dayjs';
import { memo, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
    targetDate: string;
    label: string;
    onZero?: () => void;
    variant?: 'upcoming' | 'active';
}

export const CountdownTimer = memo(({ targetDate, label, onZero, variant = 'active' }: CountdownTimerProps) => {
    const [msLeft, setMsLeft] = useState<number>(0);

    useEffect(() => {
        const tick = () => {
            const diff = dayjs(targetDate).diff(dayjs());
            if (diff <= 0) {
                setMsLeft(0);
                onZero?.();
                return;
            }
            setMsLeft(diff);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate, onZero]);

    const timeLeft = useMemo(() => dayjs.duration(msLeft), [msLeft]);
    
    // Critical state: less than 5 minutes remaining
    const isCritical = msLeft > 0 && msLeft < 300000 && variant === 'active';

    if (msLeft <= 0) return null;

    const units = [
        { label: 'Days', value: Math.floor(timeLeft.asDays()) },
        { label: 'Hrs', value: timeLeft.hours() },
        { label: 'Min', value: timeLeft.minutes() },
        { label: 'Sec', value: timeLeft.seconds() },
    ].filter(u => u.label !== 'Days' || u.value > 0);

    return (
        <div className="flex flex-col items-center py-4">
            <span className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                {label}
            </span>
            
            <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-4">
                {units.map((unit, idx) => (
                    <div key={unit.label} className="flex items-center">
                        <motion.div
                            animate={isCritical ? { 
                                scale: [1, 1.02, 1],
                                borderColor: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.2)']
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`
                                relative flex min-w-[70px] flex-col items-center rounded-2xl border bg-white p-3 shadow-sm transition-colors duration-500
                                ${isCritical 
                                    ? 'border-red-200 dark:border-red-900/50 dark:bg-red-950/20' 
                                    : 'border-gray-100 dark:border-gray-700 dark:bg-gray-800'
                                }
                            `}
                        >
                            <span className={`
                                font-mono text-2xl font-black tabular-nums tracking-tighter sm:text-3xl
                                ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}
                            `}>
                                {String(unit.value).padStart(2, '0')}
                            </span>
                            <span className="mt-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                {unit.label}
                            </span>
                        </motion.div>
                        
                        {/* Elegant Separator */}
                        {idx < units.length - 1 && (
                            <div className="ml-2 flex flex-col gap-1 opacity-20 sm:ml-4">
                                <div className="h-1 w-1 rounded-full bg-current" />
                                <div className="h-1 w-1 rounded-full bg-current" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

CountdownTimer.displayName = 'CountdownTimer';