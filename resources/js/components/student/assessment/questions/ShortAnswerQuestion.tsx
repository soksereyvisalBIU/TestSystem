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
        <div className="w-full space-y-4 rounded-2xl border bg-white p-6 shadow-lg">
            {/* ---------------- Toolbar ---------------- */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2">
                        <MessageSquareText className="h-5 w-5 text-blue-600" />
                    </div>
                    <Label
                        htmlFor={`question-${question.id}`}
                        className="text-lg font-bold text-gray-800"
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
                            <SelectTrigger className="h-9 w-[140px] bg-slate-100 font-mono text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGE_OPTIONS.map((lang) => (
                                    <SelectItem
                                        key={lang.value}
                                        value={lang.value}
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
                        className="flex items-center gap-2"
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
                className={`relative overflow-hidden rounded-xl border-2 transition-all
                ${isCodeMode
                    ? 'border-slate-800 bg-[#2d2d2d] shadow-inner'
                    : 'border-gray-200 bg-white'}`}
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
                            fontFamily:
                                '"Fira Code", "Fira Mono", monospace',
                            fontSize: 14,
                            minHeight: 250,
                            color: '#ccc',
                            outline: 'none',
                        }}
                    />
                ) : (
                    <textarea
                        id={`question-${question.id}`}
                        aria-label="Short answer input"
                        className="min-h-[250px] w-full resize-none bg-transparent p-5 text-base focus:outline-none"
                        value={answer}
                        onChange={(e) => handleChange(e.target.value)}
                        onPaste={preventPaste}
                        placeholder="Write your explanation here..."
                    />
                )}
            </div>

            {/* ---------------- Footer ---------------- */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <Settings2 className="h-3 w-3" />
                    <span>
                        {isCodeMode
                            ? `Highlighter: ${language}`
                            : 'Standard Mode'}
                    </span>
                </div>

                <span className="text-sm font-bold text-gray-500">
                    {currentLength.toLocaleString()} /{' '}
                    {MAX_CHARACTERS.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
