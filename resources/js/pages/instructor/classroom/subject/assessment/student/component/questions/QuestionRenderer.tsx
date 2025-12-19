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
    const config = {
        correct: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Correct' },
        incorrect: { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle, label: 'Incorrect' },
        partial: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Partial' },
        review: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Edit3, label: isManual ? 'Graded' : 'Needs Review' },
        unanswered: { color: 'bg-slate-50 text-slate-500 border-slate-200', icon: HelpCircle, label: 'No Answer' },
    };
    const current = config[status] || config.unanswered;
    const Icon = current.icon;

    return (
        <Badge variant="outline" className={cn('gap-1.5 py-1.5 px-3 ring-1 ring-inset', current.color)}>
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{current.label}</span>
        </Badge>
    );
};

export const QuestionRenderer = ({ question, answers, onTeacherScore }) => {
    const autoResult = calculateAutoScore(question, answers);
    const ans = answers[0] || {};

    // Determine final score based on priority: Manual Draft > Stored DB > Auto Calculated
    const isManualDraft = ans.manual_score !== undefined && ans.manual_score !== null && ans.manual_score !== '';
    const hasStoredScore = ans.points_earned !== undefined && ans.points_earned !== null;

    const finalScore = isManualDraft 
        ? parseFloat(ans.manual_score) 
        : (hasStoredScore ? parseFloat(ans.points_earned) : autoResult.earnedPoints);

    // Determine Status
    let displayStatus = autoResult.status;
    if (isManualDraft || hasStoredScore) {
        if (finalScore >= autoResult.maxPoints) displayStatus = 'correct';
        else if (finalScore > 0) displayStatus = 'partial';
        else displayStatus = 'incorrect';
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="relative mb-6 rounded-xl bg-slate-50/50 p-5 ring-1 ring-slate-100">
                <div className="prose prose-sm max-w-none text-slate-800"
                     dangerouslySetInnerHTML={{ __html: question.question_text }} />
            </div>

            <div className="flex-grow">
                {question.type === 'matching' && <MatchingQuestion question={question} answers={answers} />}
                {(question.type === 'multiple_choice' || question.type === 'true_false') && 
                    <ChoiceQuestion question={question} answers={answers} />}
                {(question.type === 'short_answer' || question.type === 'fill_blank') && (
                    <TextQuestion question={question} answers={answers} onTeacherScore={onTeacherScore} />
                )}
            </div>

            <Separator className="my-8" />

            <div className="flex items-center justify-between bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                    <StatusBadge status={displayStatus} isManual={isManualDraft || hasStoredScore} />
                    {isManualDraft && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest animate-pulse">
                            <Edit3 className="h-3 w-3" /> Draft Override
                        </span>
                    )}
                    {!isManualDraft && hasStoredScore && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            <Save className="h-3 w-3" /> Stored Score
                        </span>
                    )}
                </div>

                <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 pr-4 shadow-sm">
                    <div className={cn(
                        "flex h-9 w-12 items-center justify-center rounded-full text-sm font-black",
                        finalScore > 0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                        {finalScore}
                    </div>
                    <span className="ml-3 text-[10px] font-bold uppercase text-slate-400">
                        / {autoResult.maxPoints} pts
                    </span>
                </div>
            </div>
        </div>
    );
};