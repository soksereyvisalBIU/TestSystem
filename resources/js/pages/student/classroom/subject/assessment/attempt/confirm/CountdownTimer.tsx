// components/student/confirm/CountdownTimer.tsx
import dayjs from 'dayjs';
import { memo, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

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
    const isCritical = msLeft > 0 && msLeft < 300000 && variant === 'active';

    if (msLeft <= 0) return null;

    const units = [
        { label: 'd', fullLabel: 'Days', value: Math.floor(timeLeft.asDays()) },
        { label: 'h', fullLabel: 'Hrs', value: timeLeft.hours() },
        { label: 'm', fullLabel: 'Min', value: timeLeft.minutes() },
        { label: 's', fullLabel: 'Sec', value: timeLeft.seconds() },
    ].filter(u => u.fullLabel !== 'Days' || u.value > 0);

    return (
        <div className="flex flex-col items-center py-2 sm:py-4">
            {/* Reduced label margin on mobile */}
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 sm:mb-4 sm:text-[11px]">
                {label}
            </span>
            
            <div className="flex items-center justify-center gap-1.5 sm:gap-4">
                {units.map((unit, idx) => (
                    <div key={unit.fullLabel} className="flex items-center">
                        <motion.div
                            animate={isCritical ? { 
                                scale: [1, 1.05, 1],
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            /* Mobile Optimization: 
                               - min-w-[50px] instead of 70px
                               - horizontal flex for units to save height
                            */
                            className={`
                                relative flex min-w-[52px] flex-col items-center rounded-xl border bg-white p-1.5 shadow-sm transition-colors duration-500 sm:min-w-[70px] sm:rounded-2xl sm:p-3
                                ${isCritical 
                                    ? 'border-red-200 dark:border-red-900/50 dark:bg-red-950/20' 
                                    : 'border-gray-100 dark:border-gray-700 dark:bg-gray-800'
                                }
                            `}
                        >
                            <span className={`
                                font-mono text-xl font-black tabular-nums tracking-tighter sm:text-3xl
                                ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}
                            `}>
                                {String(unit.value).padStart(2, '0')}
                            </span>
                            <span className="text-[8px] font-bold text-gray-400 uppercase sm:mt-1 sm:text-[9px]">
                                {unit.fullLabel}
                            </span>
                        </motion.div>
                        
                        {/* Smaller Separator dots */}
                        {idx < units.length - 1 && (
                            <div className="ml-1.5 flex flex-col gap-0.5 opacity-20 sm:ml-4 sm:gap-1">
                                <div className="h-0.5 w-0.5 rounded-full bg-current sm:h-1 sm:w-1" />
                                <div className="h-0.5 w-0.5 rounded-full bg-current sm:h-1 sm:w-1" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

CountdownTimer.displayName = 'CountdownTimer';