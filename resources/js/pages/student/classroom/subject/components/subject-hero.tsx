import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, FileText, GraduationCap } from 'lucide-react';
import { useMemo } from 'react';

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
    name,
    description,
    cover,
    year,
    semester,
    onViewReports,
}: SubjectHeroProps) {
    // Performance: Memoize image URL to prevent string concatenation on every render
    const imageUrl = useMemo(() => {
        if (!cover)
            return 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop';
        // Ensure path is clean
        const path = cover.startsWith('/') ? cover : `/${cover}`;
        return `/storage${path}`;
    }, [cover]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="group relative transform-gpu overflow-hidden rounded-[1.5rem] border border-border/50 bg-muted shadow-2xl md:rounded-[2.5rem]"
        >
            {/* Background Layer with Optimized Rendering */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 transform-gpu bg-cover bg-center transition-transform duration-[5s] ease-out will-change-transform group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                    role="img"
                    aria-label={name}
                />
                {/* Unified Overlay: Better for mobile GPU over multiple div layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-6 md:p-12 lg:p-16">
                <div className="">
                    {/* <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"> */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <Badge className="border-primary/30 bg-primary/20 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md md:text-xs">
                                <Calendar className="mr-1.5 h-3.5 w-3.5" />{' '}
                                {year}
                            </Badge>
                            <Badge className="border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md md:text-xs">
                                <GraduationCap className="mr-1.5 h-3.5 w-3.5" />{' '}
                                Sem {semester}
                            </Badge>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-3">
                            <h1 className="text-3xl leading-[0.95] font-black tracking-tight text-white uppercase xs:text-4xl sm:text-4xl md:text-5xl">
                                {name}
                            </h1>
                            <p className="line-clamp-2 text-sm leading-relaxed font-medium text-white/70 md:line-clamp-none md:text-lg">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sub-stat strip */}
                <div className="hidden sm:grid mt-2 pt-4 sm:mt-6 sm:pt-8  grid-cols-2 gap-3 sm:gap-6 border-t border-white/10  md:flex md:flex-wrap md:gap-16">
                    <StatItem label="Status" value="In Progress" active />
                    <StatItem label="Enrolled" value="24 Students" />
                    <StatItem label="Type" value="Mandatory Course" />
                    {/* Action Area */}
                    {onViewReports && (
                        <div className="flex w-full shrink-0 flex-col sm:w-auto">
                            <Button
                                size="lg"
                                onClick={onViewReports}
                                className="group/btn h-12 rounded-2xl bg-primary px-8 text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-300 hover:bg-primary/90 active:scale-95 "
                            >
                                <FileText className="mr-2 h-5 w-5 transition-transform group-hover/btn:rotate-6" />
                                <span className="text-sm font-bold  md:text-base">
                                    Analytics
                                </span>
                                <ChevronRight className="ml-2 h-4 w-4 hidden sm:block opacity-50 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Performance: Extracted sub-component to prevent unnecessary re-renders of the main block
function StatItem({
    label,
    value,
    active = false,
}: {
    label: string;
    value: string;
    active?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                {label}
            </span>
            <span className="flex items-center gap-2 text-sm font-bold text-white md:text-base">
                {active && (
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                )}
                {value}
            </span>
        </div>
    );
}
