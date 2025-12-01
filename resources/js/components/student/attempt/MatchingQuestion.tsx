import { MoveRightIcon } from 'lucide-react';
import { useMemo } from 'react';
interface MatchingProps {
    q: any;
    answers: Record<number, any>;
    setData: (key: string, value: any) => void;
}

export default function MatchingQuestion({ q, answers, setData }: MatchingProps) {
    const currentAnswers = answers[q.id] || {};

    const handleDrop = (leftOptId: number, rightId: number) => {
        const prev = { ...currentAnswers };
        prev[leftOptId] = rightId;
        setData('answers', { ...answers, [q.id]: prev });
    };

    const handleReturn = (rightId: number) => {
        const prev = { ...currentAnswers };
        Object.keys(prev).forEach((k) => {
            if (prev[k] === rightId) delete prev[k];
        });
        setData('answers', { ...answers, [q.id]: prev });
    };

    // ✅ Shuffle only once — when the component first renders
    const shuffledRightOptions = useMemo(
        () => [...q.options.filter((opt: any) => opt.side === 2)].sort(() => Math.random() - 0.5),
        [q.id], // only reshuffle if the question changes
    );
    return (
        // <div className="grid gap-6 md:grid-cols-2">
        // <div className="grid gap-6 md:grid-cols-1">
        <div className="flex flex-col flex-col-reverse gap-2 md:grid-cols-1">
            {/* Left side */}
            <div className="rounded-xl border bg-background p-4 text-sm shadow-sm">
                <h3 className="mb-3 font-semibold">Match the following</h3>
                {q.options
                    .filter((opt: any) => opt.side === 1)
                    .map((leftOpt: any) => {
                        const matchedId = currentAnswers[leftOpt.id];
                        const matchedOption = q.options.find((opt: any) => opt.id === matchedId);
                        return (
                            <div
                                key={leftOpt.id}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    const rightId = parseInt(e.dataTransfer.getData('rightId'));
                                    if (rightId) handleDrop(leftOpt.id, rightId);
                                }}
                                className={`} flex items-center justify-between gap-4 rounded-lg p-3`}
                            >
                                <div className="min-w-36 font-medium">{leftOpt.option_text}</div>
                                <MoveRightIcon />
                                <div
                                    draggable={!!matchedOption}
                                    onDragStart={(e) => {
                                        if (matchedOption) e.dataTransfer.setData('rightId', matchedOption.id.toString());
                                        handleReturn(matchedOption?.id);
                                    }}
                                    // className={`min-h-[2rem] flex-1 rounded-md border p-2 text-center ${
                                    className={`min-h-[2rem] flex-1 rounded-md border p-2 ${
                                        matchedOption ? 'cursor-grab bg-accent font-medium hover:bg-accent/80' : 'text-muted-foreground italic'
                                    } ${matchedOption ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-dashed bg-muted'} `}
                                >
                                    {matchedOption ? matchedOption.option_text : 'Drop answer here'}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Right side */}
            <div>
                <div className="rounded-xl border bg-background p-4 shadow-sm">
                    <h3 className="mb-3 font-semibold">Options</h3>
                    <div className="flex flex-wrap gap-2">
                        {shuffledRightOptions.map((rightOpt: any) => {
                            const used = Object.values(currentAnswers).includes(rightOpt.id);
                            return (
                                <div
                                    key={rightOpt.id}
                                    draggable={!used}
                                    onDragStart={(e) => e.dataTransfer.setData('rightId', rightOpt.id.toString())}
                                    onDrop={(e) => {
                                        const returnId = parseInt(e.dataTransfer.getData('rightId'));
                                        if (returnId === rightOpt.id) handleReturn(rightOpt.id);
                                    }}
                                    className={`rounded-lg border p-2 text-sm ${
                                        used ? 'cursor-not-allowed bg-muted opacity-50' : 'cursor-grab bg-accent'
                                    }`}
                                >
                                    {rightOpt.option_text}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
