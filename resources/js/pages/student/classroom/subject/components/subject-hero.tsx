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
            // Reduced rounded corners for mobile to maximize content area
            className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl bg-card border border-border/50"
        >
            {/* Background with intelligent overlay */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="h-full w-full bg-cover bg-center transition-transform duration-[3s] group-hover:scale-110"
                    style={{
                        backgroundImage: `url(${cover ? '/storage/' + cover : 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop'})`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 md:via-black/60 md:to-transparent" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>

            {/* Content Container: Responsive padding (p-5 vs p-8+) */}
            <div className="relative z-10 p-5 md:p-12 lg:p-16">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-3 md:space-y-4">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <Badge className="bg-primary/30 text-white border-primary/40 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                <Calendar className="mr-1 h-3 w-3" /> {year}
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                <GraduationCap className="mr-1 h-3 w-3" /> Sem {semester}
                            </Badge>
                        </div>

                        {/* Title & Description: Significant font scaling for mobile */}
                        <div className="space-y-2">
                            <h1 className="text-xl xs:text-2xl sm:text-3xl font-[1000] text-white md:text-7xl tracking-tighter leading-[1.1] uppercase">
                                {name}
                            </h1>
                            <p className="max-w-2xl text-sm md:text-xl text-white/80 leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Action Area: Full width on small screens */}
                    {onViewReports && (
                        <div className="flex flex-col w-full sm:w-auto">
                            <Button
                                size="lg"
                                onClick={onViewReports}
                                className="group/btn h-10 xs:h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 px-6 md:px-8 shadow-xl shadow-primary/20"
                            >
                                <FileText className="mr-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover/btn:scale-110" />
                                <span className="font-bold text-sm md:text-base">Analytics Report</span>
                                <ChevronRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sub-stat strip: Grid for mobile, flex for desktop */}
                <div className="mt-3 pt-3 xs:mt-6 grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-12 border-t border-white/10 xs:pt-5 md:pt-6">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</span>
                        <span className="text-white text-xs md:text-base font-bold flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                             In Progress
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Enrolled</span>
                        <span className="text-white text-xs md:text-base font-bold">24 Students</span>
                    </div>
                    <div className="flex flex-col gap-0.5 col-span-2 md:col-span-1">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Type</span>
                        <span className="text-white text-xs md:text-base font-bold">Mandatory Course</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}