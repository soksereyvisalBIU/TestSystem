import { useMemo, useState } from 'react';
import Editor from 'react-simple-code-editor';

import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// ---------------- PRISM LANGUAGE SETUP (ORDER IS CRITICAL) ----------------

// Base
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';

// Common languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';

// PHP (⚠ MUST include php-extras)
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-php-extras';

// ---------------- UI ----------------
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Code, MessageSquareText, Settings2, Type } from 'lucide-react';

const MAX_CHARACTERS = 2000;

const LANGUAGE_OPTIONS = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'C++', value: 'cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'HTML', value: 'markup' },
    { label: 'CSS', value: 'css' },
    { label: 'PHP', value: 'php' },
];

interface Props {
    question: {
        id: number | string;
        text?: string;
    };
    answer: string;
    onChange: (questionId: number | string, value: string) => void;
}

// ... (imports remain the same)

export default function ShortAnswerQuestion({
    question,
    answer = '',
    onChange,
}: Props) {
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const currentLength = answer.length;

    const preventPaste = (e: React.ClipboardEvent) => e.preventDefault();

    const handleChange = (value: string) => {
        if (value.length <= MAX_CHARACTERS) onChange(question.id, value);
    };

    const highlightedCode = useMemo(() => {
        const grammar = Prism.languages[language];
        if (!grammar) return answer;
        try { return Prism.highlight(answer, grammar, language); } 
        catch { return answer; }
    }, [answer, language]);

    return (
        <div className="w-full space-y-3 sm:space-y-4 rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-6 shadow-md">
            
            {/* ---------------- Toolbar (Responsive Stack) ---------------- */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border-b border-border pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2 shrink-0">
                        <MessageSquareText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <Label
                        htmlFor={`question-${question.id}`}
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate"
                    >
                        {question.text || 'Technical Response'}
                    </Label>
                </div>

                <div className="flex items-center justify-between xs:justify-end gap-2">
                    {isCodeMode && (
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="h-8 w-[110px] sm:w-[140px] bg-muted font-mono text-[10px] sm:text-xs border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGE_OPTIONS.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Button
                        size="sm"
                        variant={isCodeMode ? 'default' : 'outline'}
                        onClick={() => setIsCodeMode((v) => !v)}
                        className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs flex items-center gap-1.5"
                    >
                        {isCodeMode ? (
                            <><Type className="h-3 w-3" /> Text</>
                        ) : (
                            <><Code className="h-3 w-3" /> Code</>
                        )}
                    </Button>
                </div>
            </div>

            {/* ---------------- Editor (Responsive Height) ---------------- */}
            <div className={`relative overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all duration-300
                ${isCodeMode ? 'border-zinc-800 bg-[#1e1e1e]' : 'border-border bg-background'}`}
            >
                {isCodeMode ? (
                    <Editor
                        value={answer}
                        onValueChange={handleChange}
                        highlight={() => highlightedCode}
                        padding={12} // Reduced padding for XS
                        textareaId={`question-${question.id}`}
                        onPaste={preventPaste}
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 13, // Smaller font for XS
                            minHeight: 180, // Shorter base height for mobile
                            color: '#d4d4d4',
                            outline: 'none',
                        }}
                    />
                ) : (
                    <textarea
                        id={`question-${question.id}`}
                        className="min-h-[180px] w-full resize-none bg-transparent p-3 sm:p-5 text-sm sm:text-base text-body placeholder:text-description focus:outline-none"
                        value={answer}
                        onChange={(e) => handleChange(e.target.value)}
                        onPaste={preventPaste}
                        placeholder="Write your explanation here..."
                    />
                )}
            </div>

            {/* ---------------- Footer ---------------- */}
            <div className="flex items-center justify-between px-0.5">
                <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-medium text-description uppercase tracking-tighter">
                    <Settings2 className="h-2.5 w-2.5" />
                    <span>{isCodeMode ? language : 'Standard'}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] sm:text-sm font-mono">
                    <span className={currentLength > MAX_CHARACTERS * 0.9 ? 'text-destructive font-bold' : 'text-body'}>
                        {currentLength}
                    </span>
                    <span className="opacity-40">/ {MAX_CHARACTERS}</span>
                </div>
            </div>
        </div>
    );
}
