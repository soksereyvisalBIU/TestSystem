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
            // Changed bg-slate-900 to bg-card for theme consistency
            className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-card border border-border/50"
        >
            {/* Background with intelligent overlay */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="h-full w-full bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                    style={{
                        backgroundImage: `url(${cover ? '/storage/' + cover : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'})`,
                    }}
                />
                {/* Adaptive Gradient: Pure black base ensures text visibility regardless of UI theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                {/* Subtle Primary Brand Tint */}
                <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-4">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                <Calendar className="mr-1.5 h-3 w-3" /> {year}
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                <GraduationCap className="mr-1.5 h-3 w-3" /> Semester {semester}
                            </Badge>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2">
                            <h1 className="text-5xl font-[1000] text-white md:text-7xl tracking-tighter leading-[1.1] uppercase">
                                {name}
                            </h1>
                            <p className="max-w-2xl text-lg md:text-xl text-white/80 leading-relaxed font-medium">
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
                                // Uses Primary color for the button to stand out against the dark hero
                                className="group/btn h-14 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 px-8 shadow-xl shadow-primary/20"
                            >
                                <FileText className="mr-2 h-5 w-5 transition-transform group-hover/btn:scale-110" />
                                <span className="font-bold">Analytics Report</span>
                                <ChevronRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sub-stat strip */}
                <div className="mt-8 flex flex-wrap gap-12 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</span>
                        <span className="text-white font-bold flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(var(--success),0.5)]" />
                             In Progress
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Enrolled</span>
                        <span className="text-white font-bold">24 Students</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Type</span>
                        <span className="text-white font-bold">Mandatory Course</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}