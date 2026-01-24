import QuestionActions from './QuestionActions';
import QuestionFormModal from './QuestionFormModal';
import QuestionList from './QuestionList';
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
        setQuestions, 
    } = useQuestionManager(assessmentId);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="animate-pulse font-medium text-description">Loading questions...</p>
            </div>
        );
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
        <div className="container max-w-7xl mx-auto flex animate-in flex-col gap-6 p-4 duration-700 fade-in lg:flex-row bg-background">
            {/* Main Content: Question List */}
            <div className=" flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-6 space-y-4">
                    <QuestionActions
                        onAdd={() => setModalOpen(true)}
                        onSave={handleSubmitAll}
                        hasChanges={hasChanges}
                    />

                    <QuestionList
                        questions={questions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDragEnd={handleDragEnd}
                    />
                </div>
            </div>

            {/* Sidebar: Scoring & Organization */}
            <aside className="w-full space-y-6 lg:w-[380px]">
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
            </aside>

            {/* Modal */}
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
        </div>
    );
}