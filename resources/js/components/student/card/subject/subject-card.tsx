import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit, Eye } from 'lucide-react';
import { route } from 'ziggy-js';
const imageURL = `/assets/img/class/class.jpg`;

export default function SubjectCard() {
    return (
        <motion.div
            className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg"
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
            }}
        >
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-[1px] brightness-75 transition-all duration-700 group-hover:brightness-40"
                style={{
                    backgroundImage: `url('${imageURL}')`,
                }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                <div>
                    <h3 className="text-md font-semibold drop-shadow-md">
                        Batch 10 – Morning Shift
                    </h3>
                    <h3 className="text-md font-semibold drop-shadow-md">
                        Year 2025
                    </h3>
                </div>

                <div>
                    <h3 className="text-lg font-semibold drop-shadow-md">
                        Computer Science Class
                    </h3>
                    <p className="line-clamp-2 text-sm opacity-90">
                        This is a sample static description for preview
                        purposes.
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <Link
                    href={route('instructor.classes.show', 1)}
                    className="rounded-full bg-white/90 p-2 text-black shadow hover:bg-white"
                >
                    <Eye size={18} />
                </Link>

                <button className="rounded-full bg-white/90 p-2 text-black shadow hover:bg-white">
                    <Edit size={18} />
                </button>
            </div>
        </motion.div>
    );
}
