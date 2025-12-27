import SubjectCard from '@/components/cards/subjects/subject-card';
import { AnimatePresence, motion } from 'framer-motion';

export default function SubjectCardList({ filteredSubjects, classroom }: any) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <AnimatePresence mode="popLayout">
                {filteredSubjects.map((subj: any) => (
                    <SubjectCard
                        key={subj.id}
                        subject={subj}
                        classId={classroom.id}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
