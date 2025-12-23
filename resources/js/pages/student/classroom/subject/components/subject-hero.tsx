import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, Calendar, GraduationCap, ChevronRight } from 'lucide-react';

interface SubjectHeroProps {
    id: number;
    name: string;
    description: string;
    cover: string;
    year: string;
    semester: string;
    onViewReports?: () => void;
}

export function SubjectHero({
    id,
    name,
    description,
    cover,
    year,
    semester,
    onViewReports,
}: SubjectHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-[2rem] shadow-2xl bg-slate-900"
        >
            {/* Background with intelligent overlay */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${cover ? '/storage/' + cover : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'})`,
                    }}
                />
                {/* Multi-layer gradient: 
                   1. Darkens bottom for text legibility
                   2. Adds brand color tint 
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-6">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                <Calendar className="mr-1.5 h-3 w-3" /> {year}
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                <GraduationCap className="mr-1.5 h-3 w-3" /> Semester {semester}
                            </Badge>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-white md:text-7xl lg:tracking-tight leading-[1.1]">
                                {name}
                            </h1>
                            <p className="max-w-2xl text-lg md:text-xl text-slate-300/90 leading-relaxed font-medium">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Action Area */}
                    {onViewReports && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={onViewReports}
                                className="group/btn h-14 rounded-2xl bg-white text-slate-950 hover:bg-blue-50 transition-all duration-300 px-8 shadow-xl shadow-white/5"
                            >
                                <FileText className="mr-2 h-5 w-5 transition-transform group-hover/btn:scale-110" />
                                <span className="font-bold">Analytics Report</span>
                                <ChevronRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sub-stat strip (The "Best of the Best" detail) */}
                <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</span>
                        <span className="text-white font-semibold flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                             In Progress
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Enrolled</span>
                        <span className="text-white font-semibold">24 Students</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Type</span>
                        <span className="text-white font-semibold">Mandatory Course</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}