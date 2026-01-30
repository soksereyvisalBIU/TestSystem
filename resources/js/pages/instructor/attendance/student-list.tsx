import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { CheckCircle2, User } from 'lucide-react';
import { getDistanceInMeters } from './getDistanceInMeters';

export function StudentQRScanAttendance({
    students,
    coords,
}: {
    students: any;
    coords: any;
}) {
    return (
        <LayoutGroup>
            <AnimatePresence mode="popLayout">
                {[...students]
                    .sort((a, b) => b.id - a.id)
                    .map((s) => {
                        const dist = getDistanceInMeters(
                            coords[0],
                            coords[1],
                            parseFloat(s.latitude),
                            parseFloat(s.longitude),
                        );

                        const isProximate = dist < 150;

                        return (
                            <motion.div
                                key={s.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{
                                    type: 'spring',
                                    damping: 25,
                                    stiffness: 300,
                                }}
                                className={`
                                    group relative flex items-center gap-4 rounded-[2rem] p-4 shadow-sm
                                    transition-all hover:shadow-lg
                                    border border-border
                                    bg-card text-body
                                    ${
                                        isProximate
                                            ? 'ring-1 ring-ring'
                                            : 'bg-muted/40'
                                    }
                                `}
                            >
                                {/* Avatar */}
                                <div className="relative h-14 w-14 shrink-0">
                                    <div className="h-full w-full overflow-hidden rounded-2xl border border-border bg-muted">
                                        {s.avatar ? (
                                            <img
                                                src={s.avatar}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                <User size={22} />
                                            </div>
                                        )}
                                    </div>

                                    {isProximate && (
                                        <div className="absolute -right-1 -bottom-1 rounded-full bg-success p-1 text-primary-foreground ring-4 ring-card">
                                            <CheckCircle2 size={12} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-base font-black text-title">
                                        {s.name}
                                    </h4>

                                    <div className="mt-1 flex items-center gap-2">
                                        <div
                                            className={`
                                                h-1.5 w-1.5 rounded-full
                                                ${
                                                    isProximate
                                                        ? 'bg-success'
                                                        : 'animate-pulse bg-destructive'
                                                }
                                            `}
                                        />

                                        <span
                                            className={`
                                                text-[10px] font-black tracking-wider uppercase
                                                ${
                                                    isProximate
                                                        ? 'text-success'
                                                        : 'text-description'
                                                }
                                            `}
                                        >
                                            {dist.toFixed(2)}m away
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
            </AnimatePresence>
        </LayoutGroup>
    );
}
