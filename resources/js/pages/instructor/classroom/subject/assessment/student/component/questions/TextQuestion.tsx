import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    GraduationCap, Quote, CheckCircle2, Info, 
    Code2, AlertCircle, Copy, Maximize2, 
    ThumbsUp, ThumbsDown, Eraser 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TextQuestion({ question, answers, onTeacherScore }) {
    const ans = answers[0] || {};
    const studentText = ans.answer_text || '';
    const correctOptions = question.options?.map((o) => o.option_text) || [];
    const maxPoints = parseFloat(question.point || 0);
    
    // UI States
    const [isExpanded, setIsExpanded] = useState(false);
    const [tempScore, setTempScore] = useState(
        ans.manual_score ?? ans.points_earned ?? 0,
    );
    const isCodeResponse = studentText.includes('<pre>') || studentText.includes('<code>');
    const cleanText = studentText.replace(/<[^>]*>/g, '').trim();

    const handleScoreChange = (val) => {
        let numVal = val === '' ? '' : Math.min(maxPoints, Math.max(0, parseFloat(val)));
        onTeacherScore(question.id, numVal);
    };

    return (
        <div className="group/main space-y-6 animate-in fade-in zoom-in-95 duration-500">
            
            {/* --- SECTION 1: THE SUBMISSION CARD --- */}
            <div className="relative">
                <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg ring-1 shadow-sm transition-all",
                            isCodeResponse ? "bg-zinc-900 ring-white/20 text-yellow-400" : "bg-primary/10 ring-primary/20 text-primary"
                        )}>
                            {isCodeResponse ? <Code2 size={16} /> : <Quote size={16} />}
                        </div>
                        <Label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                            {isCodeResponse ? 'Technical Implementation' : 'Conceptual Response'}
                        </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 opacity-0 group-hover/main:opacity-100 transition-opacity"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <Maximize2 size={14} />
                        </Button>
                    </div>
                </div>

                <div className={cn(
                    "relative overflow-hidden rounded-3xl border-2 transition-all duration-500",
                    isCodeResponse ? "bg-[#0d0d0d] border-zinc-800" : "bg-card border-border",
                    isExpanded ? "min-h-[400px]" : "min-h-[160px]"
                )}>
                    {/* Syntax Highlight Styles for the dangerouslySetInnerHTML */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .student-content pre { background: transparent !important; padding: 0; margin: 0; font-family: 'JetBrains Mono', monospace; }
                        .student-content code { color: #f4f4f5; }
                        .student-content p { margin-bottom: 1rem; }
                    `}} />

                    <div className={cn(
                        "student-content relative z-10 p-8 prose prose-sm md:prose-base max-w-none dark:prose-invert transition-all",
                        isCodeResponse ? "prose-pre:text-zinc-300" : "prose-p:text-foreground/90 font-serif"
                    )}>
                        {studentText ? (
                            <div dangerouslySetInnerHTML={{ __html: studentText }} />
                        ) : (
                            <div className="flex items-center gap-3 text-muted-foreground italic py-10 justify-center">
                                <AlertCircle size={18} />
                                <span className="tracking-tight">Student did not submit an answer for this prompt.</span>
                            </div>
                        )}
                    </div>

                    {/* Character/Word Meta */}
                    {studentText && (
                        <div className="absolute bottom-4 right-6 flex gap-4">
                            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                                {cleanText.split(/\s+/).length} Words
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-tighter">
                                {cleanText.length} Chars
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SECTION 2: SMART RUBRIC --- */}
            {correctOptions.length > 0 && (
                <div className="relative rounded-[2rem] border border-dashed border-emerald-500/30 bg-emerald-500/[0.02] p-6 transition-all hover:bg-emerald-500/[0.04]">
                    <div className="mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} className="animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">Reference Key</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {correctOptions.map((opt, i) => (
                            <Badge 
                                key={i} 
                                variant="outline" 
                                className="border-emerald-200 bg-background/80 px-3 py-1 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                            >
                                {/* {opt} */}
                                <div dangerouslySetInnerHTML={{ __html: opt }} />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SECTION 3: THE HIGH-VELOCITY GRADING BAR --- */}
            {onTeacherScore && (
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-lg transition-all hover:border-primary/30 md:flex-row md:items-center">
                    {/* LEFT: COMPACT SCORE HUD */}
                    <div className="relative flex  flex-row items-center justify-center gap-3 bg-primary px-6 py-4 text-primary-foreground md:flex-col md:py-6">
                        <div className="flex items-baseline gap-1">
                            <input
                                type="number"
                                step="0.5"
                                value={tempScore}
                                onChange={(e) => {
                                    const raw =
                                        e.target.value === ''
                                            ? 0
                                            : parseFloat(e.target.value);
                                    const val = Math.min(
                                        question.point,
                                        Math.max(0, raw),
                                    );
                                    setTempScore(val);
                                    onTeacherScore(question.id, val);
                                }}
                                className="w-16 bg-transparent text-right font-mono text-xl font-black tabular-nums transition-transform outline-none focus:scale-110"
                            />
                            <span className="text-sm font-bold opacity-50">
                                pts
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: THE CONTROL RIBBON */}
                    <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-8">
                        {/* SLIDER BLOCK */}
                        <div className="flex flex-1 flex-col gap-1.5">
                            <div className="flex justify-between px-1">
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                    Scoring Tier
                                </span>
                                <button
                                    onClick={() => {
                                        setTempScore(0);
                                        onTeacherScore(question.id, 0);
                                    }}
                                    className="text-[10px] font-bold text-red-500 uppercase opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max={question.point}
                                    step="0.5"
                                    value={tempScore}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setTempScore(val);
                                        onTeacherScore(question.id, val);
                                    }}
                                    style={{
                                        background: `linear-gradient(to right, hsl(var(--primary)) ${(tempScore / question.point) * 100}%, hsl(var(--muted)) ${(tempScore / question.point) * 100}%)`,
                                    }}
                                    className="h-2 w-full cursor-pointer rounded-full accent-primary"
                                />
                            </div>
                        </div>

                        {/* ACTION GROUPS */}
                        <div className="flex items-center gap-2">
                            {/* Precision Controls */}
                            <div className="flex overflow-hidden rounded-xl border border-border shadow-sm">
                                <button
                                    onClick={() => {
                                        const val = Math.max(
                                            0,
                                            tempScore - 0.5,
                                        );
                                        setTempScore(val);
                                        onTeacherScore(question.id, val);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center bg-background font-bold transition-colors hover:bg-muted active:bg-primary/10"
                                >
                                    −
                                </button>
                                <div className="w-[1px] bg-border" />
                                <button
                                    onClick={() => {
                                        const val = Math.min(
                                            question.point,
                                            tempScore + 0.5,
                                        );
                                        setTempScore(val);
                                        onTeacherScore(question.id, val);
                                    }}
                                    className="flex h-9 w-9 items-center justify-center bg-background font-bold transition-colors hover:bg-muted active:bg-primary/10"
                                >
                                    +
                                </button>
                            </div>

                            {/* Smart Presets */}
                            {/* <div className="flex gap-1.5">
                                {[
                                    { label: '50%', val: 0.5 },
                                    { label: 'Full', val: 1 },
                                ].map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => {
                                            const val = question.point * p.val;
                                            setTempScore(val);
                                            onTeacherScore(question.id, val);
                                        }}
                                        className="h-9 rounded-xl border border-primary/10 bg-primary/5 px-4 text-[10px] font-black tracking-tight text-primary uppercase transition-all hover:bg-primary hover:text-white active:scale-95"
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}