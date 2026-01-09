import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    CheckCircle2,
    Edit3,
    FileUp,
    FlipHorizontal,
    HelpCircle,
    LineChart,
    Save,
    XCircle,
} from 'lucide-react';

// import FileQuestion from './FileQuestion'; // New Component Import

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAutoScore } from './calculateAutoScore';
import ChoiceQuestion from './ChoiceQuestion';
import FileQuestion from './FileQuestion';
import MatchingQuestion from './MatchingQuestion';
import TextQuestion from './TextQuestion';

const StatusBadge = ({ status, isManual }) => {
    const config = {
        correct: {
            color: 'bg-success/10 text-success border-success/20',
            icon: CheckCircle2,
            label: 'Correct',
        },
        incorrect: {
            color: 'bg-destructive/10 text-destructive border-destructive/20',
            icon: XCircle,
            label: 'Incorrect',
        },
        partial: {
            color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            icon: AlertCircle,
            label: 'Partial',
        },
        review: {
            color: 'bg-primary/10 text-primary border-primary/20',
            icon: Edit3,
            label: isManual ? 'Graded' : 'Needs Review',
        },
        unanswered: {
            color: 'bg-muted text-muted-foreground border-border',
            icon: HelpCircle,
            label: 'No Answer',
        },
    };
    const current = config[status] || config.unanswered;
    const Icon = current.icon;

    return (
        <Badge
            variant="outline"
            className={cn('gap-1.5 px-3 py-1.5 ring-0', current.color)}
        >
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
                {current.label}
            </span>
        </Badge>
    );
};

export const QuestionRenderer = ({
    index,
    question,
    answers,
    onTeacherScore,
}) => {
    const autoResult = calculateAutoScore(question, answers);
    const ans = answers[0] || {};

    const isManualDraft =
        ans.manual_score !== undefined &&
        ans.manual_score !== null &&
        ans.manual_score !== '';
    const hasStoredScore =
        ans.points_earned !== undefined && ans.points_earned !== null;

    const finalScore = isManualDraft
        ? parseFloat(ans.manual_score)
        : hasStoredScore
          ? parseFloat(ans.points_earned)
          : autoResult.earnedPoints;

    let displayStatus = autoResult.status;

    // Logic specifically for file uploads: they usually default to 'review' status until a score exists
    if (question.type === 'fileupload' && !isManualDraft && !hasStoredScore) {
        displayStatus =
            ans.file_path || ans.answer_text ? 'review' : 'unanswered';
    } else if (isManualDraft || hasStoredScore) {
        if (finalScore >= autoResult.maxPoints) displayStatus = 'correct';
        else if (finalScore > 0) displayStatus = 'partial';
        else displayStatus = 'incorrect';
    }

    return (
        <Card id={`q-${question.id}`} className="gap-0 py-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                    {/* Use primary or title background for the index circle */}
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-title text-sm font-bold text-card shadow-sm">
                        {index + 1}
                    </span>
                    <CardTitle className="text-sm font-bold text-subtitle capitalize">
                        {/* {question?.question_text} */}
                        {question.type.replace('_', ' ')}
                    </CardTitle>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col items-center">
                        <StatusBadge
                            status={displayStatus}
                            isManual={isManualDraft || hasStoredScore}
                        />

                        {isManualDraft && (
                            <span className="flex animate-pulse items-center gap-1 text-[10px] font-bold tracking-widest text-primary/50">
                                <Edit3 className="h-3 w-3" /> Draft Override
                            </span>
                        )}

                        {!isManualDraft && hasStoredScore && (
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-success/50">
                                <Save className="h-3 w-3" /> Stored Score
                            </span>
                        )}

                        {/* New Badge for File Received but not graded */}
                        {question.type === 'fileupload' &&
                            !hasStoredScore &&
                            !isManualDraft &&
                            ans.file_path && (
                                <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase">
                                    <FileUp className="h-3 w-3" /> File Received
                                </span>
                            )}
                    </div>

                    {/* Score Pill */}
                    <div className="flex items-center rounded-full border border-border bg-card p-1 pr-4 shadow-sm">
                        <div
                            className={cn(
                                'flex h-9 w-12 items-center justify-center rounded-full text-sm font-black transition-colors',
                                finalScore > 0
                                    ? 'bg-title text-card'
                                    : 'bg-muted text-description',
                            )}
                        >
                            {finalScore}
                        </div>
                        <span className="ml-3 text-[10px] font-bold text-description uppercase">
                            / {autoResult.maxPoints || question.point} pts
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow py-4">
                <div className='pb-4'>
                    <div dangerouslySetInnerHTML={{ __html: question.question_text }} />
                    {/* <h4 className="">Q: {question.question_text}</h4> */}
                    {/* <div className='w-12 h-[2px] bg-foreground/50'></div> */}
                </div>

                {/* Mapping question types to components */}
                {question.type === 'matching' && (
                    <MatchingQuestion question={question} answers={answers} />
                )}

                {(question.type === 'multiple_choice' ||
                    question.type === 'true_false') && (
                    <ChoiceQuestion question={question} answers={answers} />
                )}

                {(question.type === 'short_answer' ||
                    question.type === 'fill_blank') && (
                    <TextQuestion
                        question={question}
                        answers={answers}
                        onTeacherScore={onTeacherScore}
                    />
                )}

                {question.type === 'fileupload' && (
                    <FileQuestion
                        question={question}
                        answers={answers}
                        onTeacherScore={onTeacherScore}
                    />
                )}
            </CardContent>
        </Card>
    );
};
