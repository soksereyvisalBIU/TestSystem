import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2, Plus, ArrowRightLeft, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Pair {
    left: string;
    right: string;
}

interface Props {
    data: any;
    onChange: (data: any) => void;
}

export default function MatchingForm({ data, onChange }: Props) {
    const [pairs, setPairs] = useState<Pair[]>(data?.answer || [{ left: '', right: '' }]);

    const updatePair = (index: number, key: keyof Pair, value: string) => {
        const updated = [...pairs];
        updated[index] = { ...updated[index], [key]: value };
        setPairs(updated);
        onChange({ ...data, answer: updated });
    };

    const addPair = () => {
        const updated = [...pairs, { left: '', right: '' }];
        setPairs(updated);
        onChange({ ...data, answer: updated });
    };

    const removePair = (index: number) => {
        if (pairs.length <= 1) return;
        const updated = pairs.filter((_, i) => i !== index);
        setPairs(updated);
        onChange({ ...data, answer: updated });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* Main Question Input */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label htmlFor="question" className="text-sm font-semibold text-subtitle">
                        Instruction / Prompt
                    </Label>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-description uppercase font-bold">
                        Required
                    </span>
                </div>
                <Textarea
                    id="question"
                    required
                    placeholder="e.g., Match the capital cities with their respective countries."
                    className="min-h-[100px] bg-background border-input focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed text-body"
                    value={data.question || ''}
                    onChange={(e) => onChange({ ...data, question: e.target.value })}
                />
            </div>

            {/* Pairs Container */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-semibold text-subtitle">Matching Pairs</Label>
                </div>

                <div className="space-y-3">
                    {pairs.map((p, i) => (
                        <div 
                            key={i} 
                            className="group flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-card hover:border-primary/30 hover:shadow-sm transition-all animate-in zoom-in-95 duration-200"
                        >
                            {/* Drag Handle Decoration */}
                            <div className="mt-2.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4 text-description/40" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Input
                                        required
                                        className="bg-background border-input focus:ring-primary/10 text-body"
                                        placeholder="Term (Left)"
                                        value={p.left}
                                        onChange={(e) => updatePair(i, 'left', e.target.value)}
                                    />
                                </div>

                                <div className="relative space-y-1.5">
                                    {/* Visual Connection Line */}
                                    <div className="hidden sm:block absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                                        <div className="w-4 h-[1px] bg-border" />
                                    </div>
                                    <Input
                                        required
                                        className="bg-background border-input focus:ring-primary/10 text-body"
                                        placeholder="Definition (Right)"
                                        value={p.right}
                                        onChange={(e) => updatePair(i, 'right', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Delete Action */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePair(i)}
                                className={cn(
                                    "mt-0.5 text-description/60 hover:text-destructive hover:bg-destructive/10 transition-colors",
                                    pairs.length === 1 && "opacity-0 pointer-events-none"
                                )}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Add Pair Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={addPair}
                    className="w-full py-6 border-dashed border-2 border-border text-description hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group bg-transparent rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add another matching pair
                </Button>
            </div>
        </div>
    );
}