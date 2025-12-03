import QuestionActions from './QuestionActions';
import QuestionList from './QuestionList';
import QuestionFormModal from './QuestionFormModal';
import OrderQuestionByTypeSetting from './components/OrderQuestion';
import ScoreSettings from './hooks/ScoreSettings';
import { useQuestionManager } from './hooks/useQuestionManager';

export default function QuestionManager({
    assessmentId,
}: {
    assessmentId: number;
}) {
    const {
        questions,
        isLoading,
        hasChanges,
        isModalOpen,
        selectedQuestion,
        editIndex,
        setModalOpen,
        handleAddQuestion,
        handleEdit,
        handleDelete,
        handleDragEnd,
        handleSubmitAll,
        totalScore,
        setTotalScore,
        typePercentages,
        setTypePercentages,
        autoPoints,
        setAutoPoints,
        recalculatePoints,
        setQuestions, // make sure useQuestionManager exposes this
    } = useQuestionManager(assessmentId);

    if (isLoading) {
        return <p className="p-4 text-gray-500">Loading questions...</p>;
    }

    // ✅ Create question type list with counts
    const questionTypes = Object.entries(
        questions.reduce(
            (acc, q) => {
                if (!q?.type) return acc;
                acc[q.type] = (acc[q.type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        ),
    ).map(([type, count]) => ({ type, count }));

    const handleSaveGroupedOrder = (newOrder: any[]) => {
        setQuestions(newOrder);
    };

    return (
        <div className="flex gap-4">
            <div className="min-w-128 rounded-xl border border-sidebar-border/70 p-4 md:min-h-min dark:border-sidebar-border">
                <QuestionActions
                    onAdd={() => setModalOpen(true)}
                    onSave={handleSubmitAll}
                    hasChanges={hasChanges}
                />

                <QuestionFormModal
                    assessmentId={assessmentId}
                    isOpen={isModalOpen}
                    setIsOpen={setModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleAddQuestion}
                    question={selectedQuestion}
                    defaultData={
                        editIndex !== null ? questions[editIndex] : undefined
                    }
                />

                <QuestionList
                    questions={questions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDragEnd={handleDragEnd}
                />
            </div>

            <div className="flex flex-col gap-4">
                <ScoreSettings
                    totalScore={totalScore}
                    setTotalScore={setTotalScore}
                    typePercentages={typePercentages}
                    setTypePercentages={setTypePercentages}
                    questionTypes={questionTypes}
                    autoPoints={autoPoints}
                    setAutoPoints={setAutoPoints}
                />

                <OrderQuestionByTypeSetting
                    questions={questions}
                    onSave={handleSaveGroupedOrder}
                />
            </div>
        </div>
    );
}
