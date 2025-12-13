import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { route } from 'ziggy-js';

interface Classroom {
    id: number;
    batch: string | number;
    shift: string;
    year: number;
    name: string; 
    description: string;
}

interface ClassCardProps {
    classroom: Classroom;
}

const defaultImageURL = `/assets/img/class/39323.jpg`;

export default function ClassCard({ classroom }: ClassCardProps) {
    const { id, batch, shift, year, name, description } = classroom;
    const imageURL = defaultImageURL; 

    return (
        <Link href={route('student.classes.show', id)}>
            <motion.div
                layoutId={`class-card-${id}`}
                className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all duration-300" 
                // ENHANCEMENT 1: Interactive Detail (Focus Ring/Border) on Hover
                whileHover={{ 
                    scale: 1.02, 
                    // boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                    // Custom style to simulate a subtle blue focus ring/glow
                    // outline: '4px solid rgba(147, 197, 253, 0.7)', // light-blue-300 with opacity
                    // outlineOffset: '0px'
                }}
                // transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
                {/* Background Image */}
                <motion.div
                    layoutId={`class-bg-${id}`}
                    className="absolute inset-0 bg-cover bg-center blur-[1px] brightness-75 bg-gray-700"
                    style={{ backgroundImage: `url('${imageURL}')` }}
                />

                {/* Content Overlay */}
                <div 
                    className="absolute inset-0 flex flex-col justify-between p-4 text-white"
                    // ENHANCEMENT 2: Aesthetic Clarity (Faux Gradient)
                    style={{ 
                        // Subtle black gradient from top-middle to bottom, making the bottom darker for better text contrast
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' 
                    }}
                >
                    {/* Top Content: Batch/Shift/Year */}
                    <motion.div layoutId={`class-meta-${id}`}>
                        <h3 className="text-md font-semibold">
                            Batch {batch} – {shift} Shift
                        </h3>
                        {/* ENHANCEMENT 3: Structural Consistency (Metadata Color Pop) */}
                        <h3 className="text-md font-extrabold "> 
                            Year {year}
                        </h3>
                    </motion.div>

                    {/* Bottom Content: Eye-Catchy Name & Refined Description */}
                    <motion.div layoutId={`class-title-${id}`}>
                        {/* Eye-Catchy Subject Name */}
                        <h3 
                            className="text-xl font-extrabold leading-tight" 
                            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }} 
                        >
                            {name}
                        </h3>
                        {/* Refined Description */}
                        <p className="line-clamp-2 text-sm font-medium opacity-100">
                            {description}
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}