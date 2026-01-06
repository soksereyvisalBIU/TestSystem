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
import { ArrowRight, ChevronDown, GripHorizontal, X, HelpCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

const getOptionLabel = (index) => String.fromCharCode(65 + index);

export default function MatchingQuestion({
    question,
    answer = {},
    onChange,
    disabled = false,
}) {
    const left = useMemo(() => question.options.left, [question.options.left]);
    const right = useMemo(() => question.options.right, [question.options.right]);

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
        <div className="grid gap-4 sm:gap-6">
            {/* AVAILABLE OPTIONS BANK - Hidden or simplified on smallest XS if needed */}
            <div className="space-y-2">
                <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase px-1">
                    Available Matches
                </p>
                <div className="flex min-h-[40px] flex-wrap gap-1.5 rounded-xl border-2 border-dashed border-border bg-muted/20 p-2 sm:p-4">
                    {shuffledRight.map((r) => {
                        const isUsed = usedRightTexts.includes(r.text);
                        return (
                            <div
                                key={r.id}
                                draggable={!isUsed && !disabled}
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('rightText', r.text);
                                }}
                                className={`rounded-lg border px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                                    isUsed
                                        ? 'opacity-30 grayscale pointer-events-none'
                                        : 'cursor-grab border-border bg-card shadow-sm active:scale-95'
                                } `}
                            >
                                <div className="flex items-center gap-1.5">
                                    {!isUsed && <GripHorizontal className="h-3 w-3 opacity-50" />}
                                    {r.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MATCHING WORKSPACE */}
            <div className="grid gap-2 sm:gap-3">
                {left.map((l, index) => {
                    const matchedText = answer[l.id];
                    const isCurrentlyDropping = isDropping === l.id;

                    return (
                        <div
                            key={l.id}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (!disabled) setIsDropping(l.id);
                            }}
                            onDragLeave={() => setIsDropping(null)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDropping(null);
                                const txt = e.dataTransfer.getData('rightText');
                                if (txt) assign(l.id, txt);
                            }}
                            className={`flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 sm:gap-4 rounded-xl border-2 p-2 sm:p-3 transition-all 
                                ${isCurrentlyDropping ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'border-border bg-card'} 
                                ${matchedText ? 'border-emerald-500/20 bg-emerald-500/5' : ''} `}
                        >
                            {/* Left Side (Prompt) */}
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-sm font-black text-muted-foreground/50">
                                    {getOptionLabel(index)}.
                                </span>
                                <span className="text-sm font-bold text-foreground leading-tight">
                                    {l.text}
                                </span>
                            </div>

                            {/* Mobile Divider / Arrow */}
                            <div className="flex items-center justify-center xs:block">
                                <ArrowRight className={`h-3 w-3 rotate-90 xs:rotate-0 ${matchedText ? 'text-emerald-500' : 'text-muted-foreground/20'}`} />
                            </div>

                            {/* Right Side (Dropdown/Selection) */}
                            <Popover
                                open={selectingLeftId === l.id}
                                onOpenChange={(open) => !disabled && setSelectingLeftId(open ? l.id : null)}
                            >
                                <PopoverTrigger asChild>
                                    <button
                                        disabled={disabled}
                                        className={`flex h-10 items-center justify-between gap-2 rounded-lg border px-3 text-xs sm:text-sm transition-all w-full xs:w-[160px] sm:w-[200px] ${
                                            matchedText
                                                ? 'border-emerald-500 bg-card font-bold text-emerald-600 shadow-sm'
                                                : 'border-dashed border-border bg-muted/50 text-muted-foreground'
                                        } `}
                                    >
                                        <span className="truncate">
                                            {matchedText || 'Tap to match'}
                                        </span>
                                        {matchedText ? (
                                            <X
                                                className="h-3.5 w-3.5 shrink-0 text-destructive active:scale-125"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    release(l.id);
                                                }}
                                            />
                                        ) : (
                                            <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-40" />
                                        )}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[calc(100vw-3rem)] xs:w-[200px] p-0" align="end">
                                    <Command>
                                        <CommandList>
                                            <CommandEmpty className="p-4 text-[10px] text-center uppercase tracking-tighter">No items left</CommandEmpty>
                                            <CommandGroup heading="Available Matches">
                                                {unusedRight.map((opt) => (
                                                    <CommandItem
                                                        key={opt.id}
                                                        className="text-sm"
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

            {/* Instruction Footer */}
            <div className="flex items-center justify-center gap-1.5 opacity-40">
                <HelpCircle className="h-2.5 w-2.5" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Drag or Tap to complete pairs</span>
            </div>
        </div>
    );
}