import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Button } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

// Moved outside to prevent re-allocation and eliminate useMemo overhead
const TABS = [
    { value: 'light' as Appearance, icon: Sun, label: 'Light' },
    { value: 'dark' as Appearance, icon: Moon, label: 'Dark' },
] as const;

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    // Fast toggle logic: O(1) instead of O(n) findIndex
    const handleToggle = () => {
        updateAppearance(appearance === 'light' ? 'dark' : 'light');
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900',
                className,
            )}
            {...props}
        >
            {/* Desktop View: Full Tab Switcher */}
            <div className="hidden gap-1 sm:flex">
                {TABS.map(({ value, icon: Icon }) => {
                    const isActive = appearance === value;
                    return (
                        <Button
                            key={value}
                            onClick={() => !isActive && updateAppearance(value)}
                            className={cn(
                                'relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                                isActive
                                    ? 'text-neutral-900 dark:text-white'
                                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-neutral-800"
                                    transition={{
                                        type: 'spring',
                                        bounce: 0.15,
                                        duration: 0.5,
                                    }}
                                />
                            )}
                            <Icon className="relative z-10 h-4 w-4" />
                        </Button>
                    );
                })}
            </div>

            {/* Mobile View: Single Icon Cycle Button */}
            <div className="flex sm:hidden">
                <Button
                    onClick={handleToggle}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-900 shadow-sm transition-all transform-gpu active:scale-90 dark:bg-neutral-800 dark:text-white"
                    aria-label="Toggle Appearance"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {/* Optimized: Direct conditional rendering instead of .map() inside AnimatePresence */}
                        <motion.div
                            key={appearance}
                            initial={{ opacity: 0, rotate: -15, scale: 0.9 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 15, scale: 0.9 }}
                            transition={{ duration: 0.12, ease: "easeOut" }}
                        >
                            {appearance === 'light' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Button>
            </div>
        </div>
    );
}