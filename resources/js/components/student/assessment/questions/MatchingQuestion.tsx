import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ChevronDown, GripHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

// Utility function to generate sequential labels (A, B, C, ...)
const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MatchingQuestion({
    question,
    answer = {},
    onChange,
    disabled = false,
}) {
    const left = useMemo(
        () => question.options.left.map((opt) => ({ id: opt.id, text: opt.text })),
        [question.options.left],
    );

    const right = useMemo(
        () => question.options.right.map((opt) => ({ id: opt.id, text: opt.text })),
        [question.options.right],
    );

    const shuffledRight = useMemo(
        () => [...right].sort(() => Math.random() - 0.5),
        [question.id, right],
    );

    const [selectingLeftId, setSelectingLeftId] = useState(null);
    const [isDropping, setIsDropping] = useState(null);

    const assign = (leftId, rightText) => {
        if (disabled) return;
        onChange(question.id.toString(), { ...answer, [leftId]: rightText });
    };

    const release = (leftId) => {
        if (disabled) return;
        const newAnswer = { ...answer };
        delete newAnswer[leftId];
        onChange(question.id.toString(), newAnswer);
    };

    const usedRightTexts = Object.values(answer);
    const unusedRight = right.filter((r) => !usedRightTexts.includes(r.text));

    return (
        <div className="grid gap-6">
            {/* AVAILABLE OPTIONS BANK */}
            <div className="space-y-3">
                <p className="text-xs font-bold tracking-wider text-description uppercase">
                    Available Matches
                </p>
                <div className="flex min-h-[50px] flex-wrap gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4">
                    {shuffledRight.map((r) => {
                        const isUsed = usedRightTexts.includes(r.text);
                        return (
                            <div
                                key={r.id}
                                draggable={!isUsed && !disabled}
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('rightText', r.text);
                                    e.dataTransfer.effectAllowed = 'move';
                                }}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                                    isUsed
                                        ? 'cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50'
                                        : 'cursor-grab border-border bg-card text-body shadow-sm hover:border-primary hover:shadow-md active:cursor-grabbing'
                                } `}
                            >
                                <div className="flex items-center gap-2">
                                    {!isUsed && (
                                        <GripHorizontal className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    {r.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MATCHING WORKSPACE */}
            <div className="grid gap-3">
                {left.map((l,index) => {
                    const matchedText = answer[l.id];
                    const isCurrentlyDropping = isDropping === l.id;

                    return (
                        <div
                            key={l.id}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (!disabled && isDropping !== l.id)
                                    setIsDropping(l.id);
                            }}
                            onDragLeave={() => setIsDropping(null)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDropping(null);
                                const txt = e.dataTransfer.getData('rightText');
                                if (txt && !disabled) assign(l.id, txt);
                            }}
                            className={`flex items-center justify-between gap-4 rounded-lg border-2 p-3 transition-all 
                                ${isCurrentlyDropping ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border bg-card'} 
                                ${matchedText ? 'border-success/30 bg-success/5' : ''} `}
                        >
                            <div className="flex flex-1 items-center gap-3">
                                <span className="w-6 text-sm font-bold text-description">
                                    {getOptionLabel(index)}.
                                </span>
                                <span className="font-medium text-body">
                                    {l.text}
                                </span>
                            </div>

                            <ArrowRight
                                className={`h-4 w-4 ${matchedText ? 'text-success' : 'text-muted-foreground/40'}`}
                            />

                            <Popover
                                open={selectingLeftId === l.id}
                                onOpenChange={(open) =>
                                    !disabled &&
                                    setSelectingLeftId(open ? l.id : null)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <button
                                        disabled={disabled}
                                        className={`flex h-10 min-w-[160px] items-center justify-between gap-2 rounded-md border px-4 text-sm transition-all ${
                                            matchedText
                                                ? 'border-success bg-card font-semibold text-success shadow-sm'
                                                : 'border-dashed border-border bg-muted/50 text-muted-foreground hover:bg-muted'
                                        } `}
                                    >
                                        <span className="truncate">
                                            {matchedText || 'Select match...'}
                                        </span>
                                        {matchedText ? (
                                            <X
                                                className="h-4 w-4 text-destructive hover:scale-110 transition-transform"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    release(l.id);
                                                }}
                                            />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[200px] p-0 bg-popover border-border"
                                    align="end"
                                >
                                    <Command className="bg-popover">
                                        <CommandList>
                                            <CommandEmpty className="text-description p-4 text-xs text-center">
                                                No options left.
                                            </CommandEmpty>
                                            <CommandGroup heading="Available Options" className="text-description">
                                                {unusedRight.map((opt) => (
                                                    <CommandItem
                                                        key={opt.id}
                                                        className="text-body data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground"
                                                        onSelect={() => {
                                                            assign(l.id, opt.text);
                                                            setSelectingLeftId(null);
                                                        }}
                                                    >
                                                        {opt.text}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}