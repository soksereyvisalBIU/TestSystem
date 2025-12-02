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

export default function MatchingQuestion({ question, answer = {}, onChange }) {
    const left = question.options.left.map((opt, i) => ({
        id: opt.id,
        text: opt.text,
    }));
    const right = question.options.right.map((opt, i) => ({
        id: opt.id,
        text: opt.text,
    }));
    // const left = question.options.left.map((t, i) => ({ id: i, text: t }));
    // const right = question.options.right.map((t, i) => ({ id: i, text: t }));

    // shuffled display only
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

    // Detect unused based on text comparison
    const unusedRight = right.filter(
        (r) => !Object.values(answer).includes(r.text),
    );

    return (
        <div className="grid gap-6">
            {/* RIGHT OPTIONS */}
            <Card className="space-y-2 p-4">
                <h3 className="font-semibold">Options</h3>

                <div className="flex flex-wrap gap-2">
                    {shuffledRight.map((r) => {
                        const used = Object.values(answer).includes(r.text);

                        return (
                            <div
                                key={r.id}
                                draggable={!used}
                                onDragStart={(e) =>
                                    e.dataTransfer.setData('rightText', r.text)
                                }
                                className={`rounded-md border px-3 py-2 text-sm ${
                                    used
                                        ? 'bg-muted text-muted-foreground opacity-50'
                                        : 'cursor-grab bg-accent'
                                }`}
                            >
                                {r.text}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* LEFT LIST */}
            <Card className="gap-1 space-y-2 p-4">
                <h3 className="mb-2 font-semibold">Match Items</h3>

                {left.map((l) => {
                    const matchedText = answer[l.id];
                    const matchedRight = right.find(
                        (r) => r.text === matchedText,
                    );

                    return (
                        <div
                            key={l.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const txt = e.dataTransfer.getData('rightText');
                                if (txt) assign(l.id, txt);
                            }}
                            className="relative flex items-center gap-2 rounded-md border p-3"
                        >
                            <div className="min-w-50 text-sm">{l.text}</div>
                            <div>→</div>

                            {/* ANSWER FIELD */}
                            <Popover
                                open={selectingLeftId === l.id}
                                onOpenChange={(open) =>
                                    setSelectingLeftId(open ? l.id : null)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <div
                                        draggable={!!matchedRight}
                                        onDragStart={(e) => {
                                            if (matchedRight) {
                                                e.dataTransfer.setData(
                                                    'rightText',
                                                    matchedRight.text,
                                                );
                                                release(matchedRight.text);
                                            }
                                        }}
                                        onDoubleClick={() => {
                                            if (matchedRight) {
                                                release(matchedRight.text);
                                            } else {
                                                setSelectingLeftId(l.id);
                                            }
                                        }}
                                        className={`min-h-[2.5rem] flex-1 rounded-md border p-2 text-center text-sm ${
                                            matchedRight
                                                ? 'cursor-grab border-green-400'
                                                : 'cursor-pointer border-dashed bg-muted text-muted-foreground italic'
                                        }`}
                                    >
                                        {matchedRight
                                            ? matchedRight.text
                                            : 'Drop or Select'}
                                    </div>
                                </PopoverTrigger>

                                {/* Selection Popup */}
                                <PopoverContent className="w-48 p-0">
                                    <Command>
                                        <CommandEmpty>
                                            No options available
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {unusedRight.map((opt) => (
                                                <CommandItem
                                                    key={opt.id}
                                                    value={opt.text}
                                                    onSelect={() => {
                                                        assign(l.id, opt.text);
                                                        setSelectingLeftId(
                                                            null,
                                                        );
                                                    }}
                                                    className="cursor-pointer"
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
            </Card>
        </div>
    );
}

// {
//     "id": "5",
//     "assessment_id": "1",
//     "question": "Aut voluptatum adipi",
//     "type": "matching",
//     "point": 20,
//     "order": 5,
//     "options": {
//         "left": [
//             {
//                 "id": 13,
//                 "text": "Alias excepteur veli"
//             },
//             {
//                 "id": 14,
//                 "text": "Laboris qui eos ut e"
//             },
//             {
//                 "id": 15,
//                 "text": "Omnis qui commodo el"
//             },
//             {
//                 "id": 16,
//                 "text": "Quam laboris id nisi"
//             },
//             {
//                 "id": 17,
//                 "text": "Et sint est maiores"
//             },
//             {
//                 "id": 18,
//                 "text": "Quis ducimus delect"
//             },
//             {
//                 "id": 19,
//                 "text": "Aut quis ea consecte"
//             },
//             {
//                 "id": 20,
//                 "text": "Nostrum explicabo E"
//             },
//             {
//                 "id": 21,
//                 "text": "Tempor aliqua Venia"
//             },
//             {
//                 "id": 22,
//                 "text": "Quia id aspernatur"
//             }
//         ],
//         "right": [
//             {
//                 "text": "Porro omnis rerum vo"
//             },
//             {
//                 "text": "Mollit reprehenderit"
//             },
//             {
//                 "text": "Dolor quis ea enim a"
//             },
//             {
//                 "text": "Consequatur Iusto n"
//             },
//             {
//                 "text": "Aut natus rem corpor"
//             },
//             {
//                 "text": "Molestias id iste se"
//             },
//             {
//                 "text": "Dolore distinctio O"
//             },
//             {
//                 "text": "Earum velit deleniti"
//             },
//             {
//                 "text": "Cupidatat omnis reru"
//             },
//             {
//                 "text": "Qui nostrum consecte"
//             }
//         ]
//     },
//     "allow_file_upload": 0,
//     "allow_code_submission": 0
// }
