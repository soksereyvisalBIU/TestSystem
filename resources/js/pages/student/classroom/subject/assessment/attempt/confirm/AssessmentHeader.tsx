// components/student/confirm/AssessmentHeader.tsx
import { FileCheck, Sparkles } from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface AssessmentHeaderProps {
    title: string;
    description: string | null;
}

export const AssessmentHeader = memo(({ title, description }: AssessmentHeaderProps) => (
    <div className="relative border-b border-gray-100 bg-gradient-to-b p-4 from-gray-50/50 to-white  text-center dark:border-gray-800 dark:from-gray-800/50 dark:to-gray-900">
        
        {/* Subtle Decorative Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[5%] h-32 w-32 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/5" />
            <div className="absolute top-[10%] -right-[5%] h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/5" />
        </div>

        <div className="relative z-10">
            {/* Animated Icon Container */}
            <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group mx-auto mb-2 flex h-12 w-12 sm:h-20 sm:w-20 items-center justify-center rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 transition-all duration-500 hover:rotate-3 hover:scale-110 dark:bg-gray-800 dark:ring-gray-700 dark:shadow-none"
            >
                <div className="relative">
                    <FileCheck className="h-6 w-6 sm:h-10 sm:w-10 text-blue-600 transition-colors group-hover:text-blue-500 dark:text-blue-400" />
                    {/* Floating Accent Icon */}
                    <motion.div
                        animate={{ 
                            y: [0, -4, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-1 -right-2 text-blue-300 dark:text-blue-600"
                    >
                        <Sparkles className="h-4 w-4" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Typography with enhanced spacing */}
            <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white"
            >
                {title}
            </motion.h1>

            {description ? (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mx-auto sm:mt-2 max-w-lg text-lg leading-relaxed text-gray-500 dark:text-gray-400"
                >
                    {description}
                </motion.p>
            ) : (
                <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gray-100 dark:bg-gray-800" />
            )}
        </div>
    </div>
));

AssessmentHeader.displayName = 'AssessmentHeader';