import { FileCheck, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';

export const AssessmentHeader = memo(({ title, description }: { title: string; description: string | null }) => (
    <div className="relative overflow-hidden border-b border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl" />

        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner ring-1 ring-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:ring-blue-800/30"
        >
            <FileCheck className="h-10 w-10 text-blue-600 drop-shadow-sm dark:text-blue-400" />
        </motion.div>

        <h1 className="relative z-10 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {title}
        </h1>
        
        {description ? (
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {description}
            </p>
        ) : (
            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-gray-100 dark:bg-gray-800" />
        )}
    </div>
));

export const InfoItem = ({ label, value, highlight, icon: Icon }: { label: string; value: string; highlight?: boolean; icon?: any }) => (
    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-transparent bg-gray-50/50 p-5 transition-all hover:border-blue-100 hover:bg-white hover:shadow-xl dark:bg-gray-800/40 dark:hover:border-blue-900/30 dark:hover:bg-gray-800/60">
        <div className="mb-2 flex items-center gap-1.5">
            {Icon && <Icon className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors" />}
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                {label}
            </span>
        </div>
        <span className={`text-lg font-bold tabular-nums tracking-tight ${
            highlight 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400' 
                : 'text-gray-900 dark:text-gray-100'
        }`}>
            {value}
        </span>
    </div>
);

export const PendingNotice = () => (
    <motion.div 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8 flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/20 dark:bg-amber-900/10"
    >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">New Attempt Available</h4>
            <p className="text-xs leading-relaxed text-amber-700/80 dark:text-amber-500/80">
                Your previous attempt was submitted. You may begin a fresh attempt now, but your previous score will be archived.
            </p>
        </div>
    </motion.div>
);