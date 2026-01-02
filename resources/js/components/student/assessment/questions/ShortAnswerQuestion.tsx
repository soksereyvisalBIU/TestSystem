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

export default function ShortAnswerQuestion({
    question,
    answer = '',
    onChange,
}: Props) {
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [language, setLanguage] = useState('javascript');

    const currentLength = answer.length;

    // ---------------- EXAM MODE: DISABLE PASTE ----------------
    const preventPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    // ---------------- VALUE HANDLER ----------------
    const handleChange = (value: string) => {
        if (value.length <= MAX_CHARACTERS) {
            onChange(question.id, value);
        }
    };

    // ---------------- SYNTAX HIGHLIGHT ----------------
    const highlightedCode = useMemo(() => {
        const grammar = Prism.languages[language];
        if (!grammar) return answer;

        try {
            return Prism.highlight(answer, grammar, language);
        } catch {
            return answer;
        }
    }, [answer, language]);

return (
    <div className="w-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg transition-all">
        {/* ---------------- Toolbar ---------------- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                </div>
                <Label
                    htmlFor={`question-${question.id}`}
                    className="text-lg font-bold text-title"
                >
                    {question.text || 'Technical Response'}
                </Label>
            </div>

            <div className="flex items-center gap-3">
                {isCodeMode && (
                    <Select
                        value={language}
                        onValueChange={setLanguage}
                    >
                        <SelectTrigger className="h-9 w-[140px] bg-muted font-mono text-xs border-border text-body">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                            {LANGUAGE_OPTIONS.map((lang) => (
                                <SelectItem
                                    key={lang.value}
                                    value={lang.value}
                                    className="text-body focus:bg-accent focus:text-accent-foreground"
                                >
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
                    className={`flex items-center gap-2 transition-colors ${
                        isCodeMode 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'border-border text-body hover:bg-muted'
                    }`}
                >
                    {isCodeMode ? (
                        <>
                            <Type className="h-4 w-4" /> Text Mode
                        </>
                    ) : (
                        <>
                            <Code className="h-4 w-4" /> Code Mode
                        </>
                    )}
                </Button>
            </div>
        </div>

        {/* ---------------- Editor ---------------- */}
        <div
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300
            ${isCodeMode
                ? 'border-zinc-800 bg-[#1e1e1e] shadow-inner' // Keep code editor distinct dark
                : 'border-border bg-background'}`}
        >
            {isCodeMode ? (
                <Editor
                    value={answer}
                    onValueChange={handleChange}
                    highlight={() => highlightedCode}
                    padding={20}
                    textareaId={`question-${question.id}`}
                    textareaAriaLabel="Code editor"
                    onPaste={preventPaste}
                    style={{
                        fontFamily: '"Instrument Sans", "Fira Code", monospace',
                        fontSize: 14,
                        minHeight: 250,
                        color: '#d4d4d4',
                        outline: 'none',
                    }}
                />
            ) : (
                <textarea
                    id={`question-${question.id}`}
                    aria-label="Short answer input"
                    className="min-h-[250px] w-full resize-none bg-transparent p-5 text-base text-body placeholder:text-description focus:outline-none"
                    value={answer}
                    onChange={(e) => handleChange(e.target.value)}
                    onPaste={preventPaste}
                    placeholder="Write your explanation here..."
                />
            )}
        </div>

        {/* ---------------- Footer ---------------- */}
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-medium text-description">
                <Settings2 className="h-3 w-3" />
                <span>
                    {isCodeMode
                        ? `Highlighter: ${language}`
                        : 'Standard Mode'}
                </span>
            </div>

            <div className="flex items-center gap-1 text-sm">
                <span className={`font-bold ${currentLength > MAX_CHARACTERS * 0.9 ? 'text-destructive' : 'text-body'}`}>
                    {currentLength.toLocaleString()}
                </span>
                <span className="text-description">/ {MAX_CHARACTERS.toLocaleString()}</span>
            </div>
        </div>
    </div>
);
}
