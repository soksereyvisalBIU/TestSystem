import { Card } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from '@/components/ui/command';
import { ArrowRight, X, ChevronDown, CheckCircle } from 'lucide-react';

export default function MatchingQuestion({ question, answer = {}, onChange }) {
    const left = question.options.left.map((opt) => ({
        id: opt.id,
        text: opt.text,
    }));
    const right = question.options.right.map((opt) => ({
        id: opt.id,
        text: opt.text,
    }));

    // shuffled display only for the right options/answers
    const shuffledRight = useMemo(
        () => [...right].sort(() => Math.random() - 0.5),
        [question.id],
    );

    // Assign text instead of ID
    const assign = (leftId, rightText) => {
        onChange(question.id, { ...answer, [leftId]: rightText });
    };

    // Release by text
    const release = (rightText) => {
        const updated = Object.fromEntries(
            Object.entries(answer).filter(([_, v]) => v !== rightText),
        );
        onChange(question.id, updated);
    };

    // Popover open controller
    const [selectingLeftId, setSelectingLeftId] = useState(null);
    const [isDropping, setIsDropping] = useState(null); // State for visual drag-over feedback

    // Detect unused based on text comparison
    const unusedRight = right.filter(
        (r) => !Object.values(answer).includes(r.text),
    );

    return (
        <div className="grid gap-6 p-4 rounded-xl bg-gray-50 shadow-lg">
            {/* Question Title */}
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {question.text || 'Match the following items:'}
            </h2>

            {/* RIGHT OPTIONS CARD */}
            <Card className="space-y-4 p-5 bg-white border-2 border-dashed border-gray-300">
                <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    Available Options
                </h3>

                <div className="flex flex-wrap gap-3">
                    {shuffledRight.map((r) => {
                        const used = Object.values(answer).includes(r.text);

                        return (
                            <div
                                key={r.id}
                                draggable={!used}
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('rightText', r.text);
                                    // Add a visual cue when dragging starts
                                    e.currentTarget.classList.add('opacity-50', 'ring-2', 'ring-blue-400');
                                }}
                                onDragEnd={(e) => {
                                    e.currentTarget.classList.remove('opacity-50', 'ring-2', 'ring-blue-400');
                                }}
                                className={`
                                    rounded-full border px-4 py-2 text-base font-medium transition-all duration-150
                                    ${
                                        used
                                            ? 'bg-green-100 text-green-700 opacity-70 border-green-400 cursor-not-allowed'
                                            : 'cursor-grab bg-blue-50 text-blue-700 border-blue-300 shadow-md hover:bg-blue-100'
                                    }
                                `}
                            >
                                {r.text}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* LEFT MATCH ITEMS LIST */}
            <Card className="gap-1 space-y-4 p-5 bg-white shadow-md">
                <h3 className="mb-2 font-semibold text-lg text-gray-700">
                    Items to Match
                </h3>

                <div className="space-y-3">
                    {left.map((l) => {
                        const matchedText = answer[l.id];
                        const matchedRight = right.find(
                            (r) => r.text === matchedText,
                        );
                        const isCurrentlyDropping = isDropping === l.id;

                        return (
                            <div
                                key={l.id}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (isDropping !== l.id) setIsDropping(l.id);
                                }}
                                onDragLeave={() => setIsDropping(null)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const txt = e.dataTransfer.getData('rightText');
                                    if (txt) assign(l.id, txt);
                                    setIsDropping(null);
                                }}
                                className={`
                                    flex items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all duration-200
                                    ${
                                        isCurrentlyDropping
                                            ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                                            : matchedRight
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 hover:border-blue-400'
                                    }
                                `}
                            >
                                {/* LEFT ITEM TEXT */}
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-semibold text-gray-900">{l.text}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-500" />
                                </div>

                                {/* ANSWER FIELD (Popover/Drop Target) */}
                                <Popover
                                    open={selectingLeftId === l.id}
                                    onOpenChange={(open) =>
                                        setSelectingLeftId(open ? l.id : null)
                                    }
                                >
                                    <PopoverTrigger asChild>
                                        <div
                                            // Draggable property allows moving an already-matched answer back to the options list or another item
                                            draggable={!!matchedRight}
                                            onDragStart={(e) => {
                                                if (matchedRight) {
                                                    e.dataTransfer.setData(
                                                        'rightText',
                                                        matchedRight.text,
                                                    );
                                                    release(matchedRight.text); // Release from current slot when drag starts
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                if (matchedRight) {
                                                    release(matchedRight.text);
                                                } else {
                                                    // Open popover only if not already matched
                                                    setSelectingLeftId(l.id); 
                                                }
                                            }}
                                            className={`
                                                min-h-[2.5rem] flex-1 min-w-[150px] flex items-center justify-center gap-2
                                                rounded-full border-2 p-2 text-center text-sm font-medium transition-colors duration-150
                                                ${
                                                    matchedRight
                                                        ? 'bg-white border-green-500 text-green-700 shadow-lg cursor-grab'
                                                        : 'bg-gray-100 border-dashed border-gray-400 text-gray-500 italic hover:border-blue-500 cursor-pointer'
                                                }
                                            `}
                                        >
                                            {matchedRight ? (
                                                <div className="flex items-center gap-2">
                                                    {matchedRight.text}
                                                    <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); release(matchedRight.text); }} />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    Drop or Select
                                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                    </PopoverTrigger>

                                    {/* Selection Popup - only shows UNUSED options */}
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandEmpty>
                                                No unused options available.
                                            </CommandEmpty>

                                            <CommandGroup>
                                                {unusedRight.map((opt) => (
                                                    <CommandItem
                                                        key={opt.id}
                                                        value={opt.text}
                                                        onSelect={() => {
                                                            assign(l.id, opt.text);
                                                            setSelectingLeftId(null);
                                                        }}
                                                        className="cursor-pointer text-base"
                                                    >
                                                        {opt.text}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}