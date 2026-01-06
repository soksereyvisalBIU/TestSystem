// // =================================================
// // /components/question-manager/hooks/useQuestionManager.ts
// // =================================================
// import {
//     useCreateQuestion,
//     useDeleteQuestion,
//     useQuestions,
//     useUpdateQuestion,
// } from '@/hooks/instructor/assessment/useQuestions';
// import { arrayMove } from '@dnd-kit/sortable';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';

// export const useQuestionManager = (assessmentId: number) => {
//     const [questions, setQuestions] = useState<any[]>([]);
//     const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
//     const [manualPointsBackup, setManualPointsBackup] = useState<any[]>([]); // 🆕 stores manual points

//     const [editIndex, setEditIndex] = useState<number | null>(null);
//     const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [hasChanges, setHasChanges] = useState(false);

//     // =================================================
//     // Scoring system
//     // =================================================
//     const [totalScore, setTotalScore] = useState<number>(100);
//     const [typePercentages, setTypePercentages] = useState<
//         Record<string, number>
//     >({});
//     const [autoPoints, setAutoPoints] = useState<boolean>(false);

//     // =================================================
//     // Hooks for API
//     // =================================================
//     const { data: existingQuestions = [], isLoading } =
//         useQuestions(assessmentId);
//     const { mutate: createQuestion } = useCreateQuestion(assessmentId);
//     const { mutate: updateQuestion } = useUpdateQuestion(assessmentId);
//     const { mutate: deleteQuestion } = useDeleteQuestion(assessmentId);

//     // =================================================
//     // Load existing questions
//     // =================================================
//     useEffect(() => {
//         if (existingQuestions?.length > 0) {
//             setQuestions(existingQuestions);
//             setOriginalQuestions(existingQuestions);
//         }
//     }, [existingQuestions]);

//     // =================================================
//     // Detect unsaved changes
//     // =================================================
//     useEffect(() => {
//         const changed =
//             JSON.stringify(questions) !== JSON.stringify(originalQuestions);
//         setHasChanges(changed);
//         // console.log(JSON.stringify(questions) , JSON.stringify(originalQuestions))
//     }, [questions, originalQuestions]);

//     // =================================================
//     // Keyboard shortcut (Ctrl+Q)
//     // =================================================
//     useEffect(() => {
//         const handleShortcut = (e: KeyboardEvent) => {
//             if (e.ctrlKey && (e.key === 'q' || e.key === 'Q')) {
//                 e.preventDefault();
//                 setModalOpen(true);
//             }
//         };
//         window.addEventListener('keydown', handleShortcut);
//         return () => window.removeEventListener('keydown', handleShortcut);
//     }, []);

//     // =================================================
//     // ✅ Manual recalc function
//     // =================================================
//     const recalculatePoints = () => {
//         if (questions.length === 0) return;

//         const grouped = questions.reduce(
//             (acc, q) => {
//                 const type = q.type || 'Unknown';
//                 acc[type] = acc[type] ? [...acc[type], q] : [q];
//                 return acc;
//             },
//             {} as Record<string, any[]>,
//         );

//         const recalculated = questions.map((q) => {
//             const type = q.type || 'Unknown';
//             const typeQuestions = grouped[type] ?? [];
//             const pct = typePercentages[type] ?? 0;
//             const typeTotal = (pct / 100) * totalScore;
//             const perQ =
//                 typeQuestions.length > 0 ? typeTotal / typeQuestions.length : 0;
//             return { ...q, point: parseFloat(perQ.toFixed(2)), updated: true };
//         });

//         setQuestions(recalculated);
//         toast.success('Points recalculated.');
//     };

//     // =================================================
//     // 🧠 Handle Auto Points toggle (backup + restore)
//     // =================================================
//     useEffect(() => {
//         if (autoPoints) {
//             // =================================================
//             // Backup current manual points
//             // =================================================
//             setManualPointsBackup(
//                 questions.map((q) => ({
//                     id: q.id ?? q.tempId,
//                     point: q.point,
//                 })),
//             );
//             recalculatePoints();
//         } else {
//             // =================================================
//             // Restore manual points when turning auto off
//             // =================================================
//             if (manualPointsBackup.length > 0) {
//                 setQuestions((prev) =>
//                     prev.map((q) => {
//                         const backup = manualPointsBackup.find(
//                             (b) => b.id === (q.id ?? q.tempId),
//                         );
//                         return backup ? { ...q, point: backup.point } : q;
//                     }),
//                 );
//                 toast.info('Manual points restored.');
//             }
//         }
//         // =================================================
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         // =================================================
//     }, [autoPoints]);

//     // =================================================
//     // 🔁 Keep recalculating when total score or percentages change (only if auto enabled)
//     // =================================================
//     useEffect(() => {
//         if (autoPoints) recalculatePoints();
//         // =================================================
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         // =================================================
//     }, [totalScore, typePercentages]);

//     // =================================================
//     // CRUD handlers
//     // =================================================
//     const handleAddQuestion = (question: any) => {
//         if (editIndex !== null) {
//             const updated = [...questions];
//             updated[editIndex] = {
//                 ...updated[editIndex],
//                 ...question,
//                 updated: true,
//             };
//             setQuestions(updated.map((q, i) => ({ ...q, order: i + 1 })));
//             setEditIndex(null);
//         } else {
//             setQuestions((prev) => {
//                 const newList = [
//                     ...prev,
//                     {
//                         ...question,
//                         isNew: true,
//                         tempId: Date.now(),
//                         order: prev.length + 1,
//                     },
//                 ];
//                 return newList.map((q, i) => ({ ...q, order: i + 1 }));
//             });
//         }
//         setModalOpen(false);
//     };

//     const handleDelete = (index: number) => {
//         const q = questions[index];
//         const newList = questions
//             .filter((_, i) => i !== index)
//             .map((q, i) => ({ ...q, order: i + 1 }));
//         setQuestions(newList);
//         if (q.id) deleteQuestion(q.id);
//         toast.success('Question deleted.');
//     };

//     const handleEdit = (index: number) => {
//         setSelectedQuestion(questions[index]);
//         setEditIndex(index);
//         setModalOpen(true);
//     };

//     const handleDragEnd = (event: any) => {
//         const { active, over } = event;
//         if (!over || active.id === over.id) return;

//         const oldIndex = questions.findIndex(
//             (q) => q.id === active.id || q.tempId === active.id,
//         );
//         const newIndex = questions.findIndex(
//             (q) => q.id === over.id || q.tempId === over.id,
//         );

//         const reordered = arrayMove(questions, oldIndex, newIndex).map(
//             (q, i) => ({
//                 ...q,
//                 order: i + 1,
//                 updated: true, // ✅ mark as changed
//             }),
//         );

//         // console.log(event);

//         setQuestions(reordered);
//     };

//     // =================================================
//     // 🧮 Handle manual point edit
//     // =================================================
//     const handlePointChange = (index: number, newPoint: number) => {
//         setQuestions((prev) =>
//             prev.map((q, i) =>
//                 i === index ? { ...q, point: newPoint, updated: true } : q,
//             ),
//         );
//     };

//     // =================================================
//     // 💾 Save all
//     // =================================================
//     const handleSubmitAll = () => {
//         const newQs = questions.filter((q) => q.isNew);
//         const updatedQs = questions.filter((q) => q.updated);

//         if (newQs.length === 0 && updatedQs.length === 0) {
//             toast.info('No changes to submit.');
//             return;
//         }

//         newQs.forEach((q) => createQuestion(q));
//         updatedQs.forEach((q) => updateQuestion(q));

//         setOriginalQuestions(questions);
//         setHasChanges(false);
//         toast.success('All changes saved.');
//     };

//     return {
//         questions,
//         setQuestions,
//         isLoading,
//         hasChanges,
//         isModalOpen,
//         selectedQuestion,
//         editIndex,
//         totalScore,
//         setTotalScore,
//         typePercentages,
//         setTypePercentages,
//         autoPoints,
//         setAutoPoints,
//         setModalOpen,
//         handleAddQuestion,
//         handleEdit,
//         handleDelete,
//         handleDragEnd,
//         handlePointChange,
//         handleSubmitAll,
//         recalculatePoints,
//     };
// };


import {
    useCreateQuestion,
    useDeleteQuestion,
    useQuestions,
    useUpdateQuestion,
} from '@/hooks/instructor/assessment/useQuestions';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Storage key helper to prevent assessment data clashing
const getStorageKey = (id: number) => `assessment_backup_${id}`;

export const useQuestionManager = (assessmentId: number) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
    const [manualPointsBackup, setManualPointsBackup] = useState<any[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const [totalScore, setTotalScore] = useState<number>(100);
    const [typePercentages, setTypePercentages] = useState<Record<string, number>>({});
    const [autoPoints, setAutoPoints] = useState<boolean>(false);

    const { data: existingQuestions = [], isLoading } = useQuestions(assessmentId);
    const { mutate: createQuestion } = useCreateQuestion(assessmentId);
    const { mutate: updateQuestion } = useUpdateQuestion(assessmentId);
    const { mutate: deleteQuestion } = useDeleteQuestion(assessmentId);

    // =================================================
    // 💾 Backup Logic: Initialization
    // =================================================
    useEffect(() => {
        const savedBackup = localStorage.getItem(getStorageKey(assessmentId));
        
        if (savedBackup) {
            try {
                const parsed = JSON.parse(savedBackup);
                setQuestions(parsed);
                // We keep originalQuestions as existingQuestions to detect changes against DB
                setOriginalQuestions(existingQuestions);
                toast.info('Restored unsaved changes from backup');
            } catch (e) {
                console.error("Failed to parse backup", e);
            }
        } else if (existingQuestions?.length > 0) {
            setQuestions(existingQuestions);
            setOriginalQuestions(existingQuestions);
        }
        setIsInitialized(true);
    }, [existingQuestions, assessmentId]);

    // =================================================
    // 💾 Backup Logic: Save on Change
    // =================================================
    useEffect(() => {
        if (!isInitialized) return;

        const changed = JSON.stringify(questions) !== JSON.stringify(originalQuestions);
        setHasChanges(changed);

        if (changed) {
            localStorage.setItem(getStorageKey(assessmentId), JSON.stringify(questions));
        } else {
            // Clear storage if the state matches the database (e.g., after save or manual revert)
            localStorage.removeItem(getStorageKey(assessmentId));
        }
    }, [questions, originalQuestions, assessmentId, isInitialized]);

    // =================================================
    // Keyboard shortcut (Ctrl+Q)
    // =================================================
    useEffect(() => {
        const handleShortcut = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === 'q' || e.key === 'Q')) {
                e.preventDefault();
                setModalOpen(true);
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    const recalculatePoints = () => {
        if (questions.length === 0) return;
        const grouped = questions.reduce((acc, q) => {
            const type = q.type || 'Unknown';
            acc[type] = acc[type] ? [...acc[type], q] : [q];
            return acc;
        }, {} as Record<string, any[]>);

        const recalculated = questions.map((q) => {
            const type = q.type || 'Unknown';
            const typeQuestions = grouped[type] ?? [];
            const pct = typePercentages[type] ?? 0;
            const typeTotal = (pct / 100) * totalScore;
            const perQ = typeQuestions.length > 0 ? typeTotal / typeQuestions.length : 0;
            return { ...q, point: parseFloat(perQ.toFixed(2)), updated: true };
        });

        setQuestions(recalculated);
    };

    useEffect(() => {
        if (autoPoints) {
            setManualPointsBackup(questions.map((q) => ({ id: q.id ?? q.tempId, point: q.point })));
            recalculatePoints();
        } else if (manualPointsBackup.length > 0) {
            setQuestions((prev) => prev.map((q) => {
                const backup = manualPointsBackup.find((b) => b.id === (q.id ?? q.tempId));
                return backup ? { ...q, point: backup.point } : q;
            }));
        }
    }, [autoPoints]);

    useEffect(() => {
        if (autoPoints) recalculatePoints();
    }, [totalScore, typePercentages]);

    // =================================================
    // CRUD handlers
    // =================================================
    const handleAddQuestion = (question: any) => {
        if (editIndex !== null) {
            const updated = [...questions];
            updated[editIndex] = { ...updated[editIndex], ...question, updated: true };
            setQuestions(updated.map((q, i) => ({ ...q, order: i + 1 })));
            setEditIndex(null);
        } else {
            setQuestions((prev) => {
                const newList = [...prev, { ...question, isNew: true, tempId: Date.now(), order: prev.length + 1 }];
                return newList.map((q, i) => ({ ...q, order: i + 1 }));
            });
        }
        setModalOpen(false);
    };

    const handleDelete = (index: number) => {
        const q = questions[index];
        const newList = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }));
        setQuestions(newList);
        if (q.id) deleteQuestion(q.id);
        toast.success('Question deleted.');
    };

    const handleEdit = (index: number) => {
        setSelectedQuestion(questions[index]);
        setEditIndex(index);
        setModalOpen(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = questions.findIndex((q) => q.id === active.id || q.tempId === active.id);
        const newIndex = questions.findIndex((q) => q.id === over.id || q.tempId === over.id);
        const reordered = arrayMove(questions, oldIndex, newIndex).map((q, i) => ({
            ...q,
            order: i + 1,
            updated: true,
        }));
        setQuestions(reordered);
    };

    const handlePointChange = (index: number, newPoint: number) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, point: newPoint, updated: true } : q)));
    };

    const handleSubmitAll = () => {
        const newQs = questions.filter((q) => q.isNew);
        const updatedQs = questions.filter((q) => q.updated);

        if (newQs.length === 0 && updatedQs.length === 0) {
            toast.info('No changes to submit.');
            return;
        }

        newQs.forEach((q) => createQuestion(q));
        updatedQs.forEach((q) => updateQuestion(q));

        // Important: Success state cleanup
        setOriginalQuestions(questions);
        localStorage.removeItem(getStorageKey(assessmentId));
        setHasChanges(false);
        toast.success('All changes saved.');
    };

    return {
        questions,
        setQuestions,
        isLoading,
        hasChanges,
        isModalOpen,
        selectedQuestion,
        editIndex,
        totalScore,
        setTotalScore,
        typePercentages,
        setTypePercentages,
        autoPoints,
        setAutoPoints,
        setModalOpen,
        handleAddQuestion,
        handleEdit,
        handleDelete,
        handleDragEnd,
        handlePointChange,
        handleSubmitAll,
        recalculatePoints,
    };
};