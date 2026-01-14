import { motion } from 'framer-motion';

export default function OnboardingCard({ icon: Icon, title, desc, color, bg }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-start gap-6 rounded-[2.5rem] border border-slate-100 bg-white p-8 transition-all hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50"
        >
            {/* Icon Container with dynamic background */}
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${bg} transition-colors duration-500 group-hover:bg-slate-900 group-hover:text-white`}>
                <Icon size={28} className={`${color} transition-colors duration-500 group-hover:text-white`} />
            </div>

            <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight text-slate-900">
                    {title}
                </h4>
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                    {desc}
                </p>
            </div>
            
            {/* Subtle indicator that appears on hover */}
            <div className="ml-auto self-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className={`h-2 w-2 rounded-full ${color.replace('text', 'bg')}`} />
            </div>
        </motion.div>
    );
}