import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Edit3, Save } from 'lucide-react';

import ChoiceQuestion from './ChoiceQuestion';
import MatchingQuestion from './MatchingQuestion';
import TextQuestion from './TextQuestion';
import { calculateAutoScore } from './calculateAutoScore';

const StatusBadge = ({ status, isManual }) => {
    // Updated to use semantic colors with alpha transparency for theme compatibility
    const config = {
        correct: { 
            color: 'bg-success/10 text-success border-success/20', 
            icon: CheckCircle2, 
            label: 'Correct' 
        },
        incorrect: { 
            color: 'bg-destructive/10 text-destructive border-destructive/20', 
            icon: XCircle, 
            label: 'Incorrect' 
        },
        partial: { 
            color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
            icon: AlertCircle, 
            label: 'Partial' 
        },
        review: { 
            color: 'bg-primary/10 text-primary border-primary/20', 
            icon: Edit3, 
            label: isManual ? 'Graded' : 'Needs Review' 
        },
        unanswered: { 
            color: 'bg-muted text-muted-foreground border-border', 
            icon: HelpCircle, 
            label: 'No Answer' 
        },
    };
    const current = config[status] || config.unanswered;
    const Icon = current.icon;

    return (
        <Badge variant="outline" className={cn('gap-1.5 py-1.5 px-3 ring-0', current.color)}>
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{current.label}</span>
        </Badge>
    );
};

export const QuestionRenderer = ({ question, answers, onTeacherScore }) => {
    const autoResult = calculateAutoScore(question, answers);
    const ans = answers[0] || {};

    const isManualDraft = ans.manual_score !== undefined && ans.manual_score !== null && ans.manual_score !== '';
    const hasStoredScore = ans.points_earned !== undefined && ans.points_earned !== null;

    const finalScore = isManualDraft 
        ? parseFloat(ans.manual_score) 
        : (hasStoredScore ? parseFloat(ans.points_earned) : autoResult.earnedPoints);

    let displayStatus = autoResult.status;
    if (isManualDraft || hasStoredScore) {
        if (finalScore >= autoResult.maxPoints) displayStatus = 'correct';
        else if (finalScore > 0) displayStatus = 'partial';
        else displayStatus = 'incorrect';
    }

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Question Box: bg-muted and border-border */}
            <div className="relative mb-6 rounded-xl bg-muted/30 p-5 border border-border">
                <div 
                    className="prose prose-sm max-w-none text-body dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: question.question_text }} 
                />
            </div>

            <div className="flex-grow">
                {question.type === 'matching' && <MatchingQuestion question={question} answers={answers} />}
                {(question.type === 'multiple_choice' || question.type === 'true_false') && 
                    <ChoiceQuestion question={question} answers={answers} />}
                {(question.type === 'short_answer' || question.type === 'fill_blank') && (
                    <TextQuestion question={question} answers={answers} onTeacherScore={onTeacherScore} />
                )}
            </div>

            <Separator className="my-8 bg-border" />

            {/* Score Footer: bg-muted and border-border */}
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                    <StatusBadge status={displayStatus} isManual={isManualDraft || hasStoredScore} />
                    
                    {isManualDraft && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                            <Edit3 className="h-3 w-3" /> Draft Override
                        </span>
                    )}
                    {!isManualDraft && hasStoredScore && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-widest">
                            <Save className="h-3 w-3" /> Stored Score
                        </span>
                    )}
                </div>

                {/* Score Pill */}
                <div className="flex items-center rounded-full border border-border bg-card p-1 pr-4 shadow-sm">
                    <div className={cn(
                        "flex h-9 w-12 items-center justify-center rounded-full text-sm font-black",
                        finalScore > 0 
                            ? "bg-title text-card" 
                            : "bg-muted text-description"
                    )}>
                        {finalScore}
                    </div>
                    <span className="ml-3 text-[10px] font-bold uppercase text-description">
                        / {autoResult.maxPoints} pts
                    </span>
                </div>
            </div>
        </div>
    );
};