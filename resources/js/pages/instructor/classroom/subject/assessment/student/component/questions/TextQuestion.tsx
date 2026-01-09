import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Quote, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TextQuestion({ question, answers, onTeacherScore }) {
    const ans = answers[0] || {};
    const studentText = ans.answer_text || '';
    const correctOptions = question.options?.map((o) => o.option_text) || [];
    const maxPoints = parseFloat(question.point || 0);

    const isAutoCorrect = correctOptions.some(
        (opt) => opt.trim().toLowerCase() === studentText.trim().toLowerCase(),
    );

    const handleScoreChange = (e) => {
        let val = e.target.value;
        if (val === '') return onTeacherScore(question.id, '');
        let numVal = Math.min(maxPoints, Math.max(0, parseFloat(val)));
        onTeacherScore(question.id, numVal);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Student Response Section */}
            <div className="group relative">
                <Label className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                    <Quote className="h-3 w-3 text-primary" />
                    Student Answer
                </Label>
                <div className={cn(
                    "relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300",
                    studentText 
                        ? "border-border bg-card shadow-sm group-hover:border-primary/20" 
                        : "border-dashed border-muted-foreground/20 bg-muted/5"
                )}>
                    {/* Visual flourish: corner accent */}
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Quote className="h-8 w-8 rotate-180" />
                    </div>

                    <p className={cn(
                        "relative z-10 text-base leading-relaxed tracking-tight",
                        studentText 
                            ? "font-medium text-foreground italic" 
                            : "text-muted-foreground italic font-light"
                    )}>
                        {studentText ? studentText : 'The student provided no text for this response.'}
                    </p>
                </div>
            </div>

            {/* Answer Key Comparison */}
            {!isAutoCorrect && correctOptions.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/30 p-5 dark:bg-emerald-950/10">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <CheckCircle2 className="h-4 w-4" /> Expected Keywords
                        </span>
                        <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600">
                            Exact Match Logic
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {correctOptions.map((opt, i) => (
                            <div
                                key={i}
                                className="flex items-center rounded-lg bg-background border border-emerald-200 px-3 py-1.5 shadow-sm transition-transform hover:scale-105"
                            >
                                <code className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                    {opt}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Teacher Grading Control - The "Action Hub" */}
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                            <GraduationCap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-foreground uppercase tracking-tight">Evaluator Scoring</h4>
                            <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                <Info className="h-3 w-3" />
                                Review answer and assign points
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Input
                                type="number"
                                step="0.5"
                                placeholder="0.0"
                                value={ans.manual_score ?? ans.points_earned ?? ''}
                                onChange={handleScoreChange}
                                className="h-12 w-full md:w-32 rounded-xl border-primary/20 bg-background pr-10 text-center font-mono text-lg font-black text-primary focus-visible:ring-primary shadow-inner"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground">
                                / {maxPoints}
                            </span>
                        </div>
                        
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-12 w-12 rounded-xl border border-primary/20 bg-background font-black text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
                            onClick={() => onTeacherScore(question.id, maxPoints)}
                            title="Assign Maximum Points"
                        >
                            MAX
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}