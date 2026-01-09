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
                                {opt}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* --- SECTION 3: THE HIGH-VELOCITY GRADING BAR --- */}
            <div className="sticky bottom-4 z-20">
                <div className="flex flex-col items-center gap-4 rounded-[2.5rem] border border-white/20 bg-background/80 p-3 shadow-2xl backdrop-blur-xl md:flex-row">
                    
                    {/* Quick Grade Presets */}
                    <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 rounded-full hover:bg-emerald-500/10 hover:text-emerald-600"
                            onClick={() => handleScoreChange(maxPoints)}
                        >
                            <ThumbsUp size={18} />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleScoreChange(0)}
                        >
                            <ThumbsDown size={18} />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 rounded-full hover:bg-zinc-200"
                            onClick={() => handleScoreChange('')}
                        >
                            <Eraser size={18} />
                        </Button>
                    </div>

                    <div className="hidden h-8 w-px bg-border/60 md:block" />

                    {/* Manual Input Core */}
                    <div className="flex flex-1 items-center justify-between gap-4 px-2 w-full md:w-auto">
                        <div className="flex flex-col items-start gap-0">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60">Final Score</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-black text-primary">Points</span>
                            </div>
                        </div>

                        <div className="relative flex items-center">
                            <Input
                                type="number"
                                step="0.5"
                                value={ans.manual_score ?? ans.points_earned ?? ''}
                                onChange={(e) => handleScoreChange(e.target.value)}
                                className="h-12 w-28 rounded-2xl border-none bg-muted/50 text-center font-mono text-xl font-black focus-visible:ring-primary shadow-inner"
                            />
                            <div className="ml-3 flex flex-col -space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Max</span>
                                <span className="text-sm font-black text-muted-foreground">{maxPoints}</span>
                            </div>
                        </div>
                    </div>

                    {/* Final Action */}
                    <Button 
                        size="lg"
                        className="w-full rounded-full bg-primary font-black tracking-tight shadow-xl shadow-primary/20 md:w-auto px-8"
                    >
                        CONFIRM GRADE
                    </Button>
                </div>
            </div>
        </div>
    );
}