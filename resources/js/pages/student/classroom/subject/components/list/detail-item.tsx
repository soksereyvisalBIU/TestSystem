import { motion } from 'framer-motion';

interface DetailItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    description?: string; // UX Bonus: Added support for sub-text
}

export function DetailItem({ icon: Icon, label, value, description }: DetailItemProps) {
    return (
        <div className="group flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-slate-50/80">
            {/* Icon Wrapper with inner glow */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-all group-hover:scale-110 group-hover:ring-blue-100">
                <Icon className="h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
                    {label}
                </span>
                <p className="text-sm font-bold leading-tight text-subtitle group-hover:text-primary">
                    {value}
                </p>
                {description && (
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}