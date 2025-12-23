import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Recommended for the "Best" UI feel
import { CheckCircle2, LayoutDashboard, ArrowRight, partyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionScreenProps {
    onReturnToDashboard?: () => void;
}

export function CompletionScreen({
    onReturnToDashboard,
}: CompletionScreenProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6 dark:from-zinc-950 dark:to-zinc-900">
            {/* Using Framer Motion for a smooth entry animation */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-lg"
            >
                {/* Decorative background element */}
                <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/10" />
                <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-900/10" />

                <div className="relative overflow-hidden rounded-[3.5rem] border border-slate-200 bg-white p-10 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Success Icon Animation */}
                    <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                        </motion.div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Well Done!
                        </h1>
                        <p className="text-lg font-medium text-slate-500 dark:text-zinc-400">
                            Your assessment has been successfully submitted and secured.
                        </p>
                    </div>

                    {/* Next Steps / Info Card */}
                    <div className="mt-10 rounded-3xl bg-slate-50 p-6 text-left dark:bg-zinc-800/50">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">What's Next?</h4>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Your instructor will be notified automatically.
                            </li>
                            <li className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-zinc-300">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Results will be available on your dashboard.
                            </li>
                        </ul>
                    </div>

                    <div className="mt-10 grid gap-4">
                        <Button
                            size="lg"
                            className="h-16 w-full rounded-2xl bg-slate-900 text-lg font-bold transition-all hover:bg-slate-800 hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            onClick={onReturnToDashboard}
                        >
                            <LayoutDashboard className="mr-2 h-5 w-5" /> 
                            Return to Dashboard
                        </Button>
                        
                        <button 
                            className="group flex items-center justify-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-zinc-200"
                            onClick={() => window.print()}
                        >
                            Download Submission Receipt
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}