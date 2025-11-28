import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Edit, Eye } from 'lucide-react';
import { route } from 'ziggy-js';

const imageURL = `/assets/img/class/39323.jpg`;

export default function ClassCard() {
    const id = 1; // Use real class id later

    return (
        <Link href={route('instructor.classes.show', id)}>
            <motion.div
                layoutId={`class-card-${id}`}
                className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
                {/* Background */}
                <motion.div
                    layoutId={`class-bg-${id}`}
                    className="absolute inset-0 bg-cover bg-center blur-[1px] brightness-75"
                    style={{ backgroundImage: `url('${imageURL}')` }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <motion.div layoutId={`class-meta-${id}`}>
                        <h3 className="text-md font-semibold">
                            Batch 10 – Morning Shift
                        </h3>
                        <h3 className="text-md font-semibold">Year 2025</h3>
                    </motion.div>

                    <motion.div layoutId={`class-title-${id}`}>
                        <h3 className="text-lg font-semibold">
                            Computer Science Class
                        </h3>
                        <p className="line-clamp-2 text-sm opacity-90">
                            This is a sample static description for preview purposes.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}
