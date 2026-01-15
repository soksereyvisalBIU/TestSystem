'use client';

import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { Plugin } from 'prosemirror-state';
import React, { useEffect } from 'react';
import { Toaster as HotToast } from 'react-hot-toast';
// UI
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    AlertCircle,
    Bold,
    Code,
    Info,
    Italic,
    List,
    MessageSquareText,
    Type,
} from 'lucide-react';
import toast from 'react-hot-toast';

const lowlight = createLowlight(common);
const MAX_CHARACTERS = 2000;

const LANGUAGE_OPTIONS = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'C++', value: 'cpp' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
];

const DisablePaste = Extension.create({
    name: 'disablePaste',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste(_, event) {
                        toast.error('Pasting is disabled for this question.');
                        event.preventDefault();
                        return true;
                    },
                    handleDrop(_, event) {
                        event.preventDefault();
                        return true;
                    },
                },
            }),
        ];
    },
});

interface Props {
    question: { id: number | string; text?: string };
    answer: string;
    onChange: (questionId: number | string, value: string) => void;
}

export default function TiptapShortAnswer({
    question,
    answer,
    onChange,
}: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            CodeBlockLowlight.configure({ lowlight }),
            CharacterCount.configure({ limit: MAX_CHARACTERS }),
            DisablePaste,
            Placeholder.configure({
                placeholder: ({ node }) =>
                    node.type.name === 'codeBlock'
                        ? '// Type your code manually...'
                        : 'Explain your reasoning...',
            }),
        ],
        content: answer || '',
        editorProps: {
            attributes: {
                // THE KEY FIXES FOR WRAPPING:
                // 1. break-all: Forces "ffff..." to break anywhere.
                // 2. whitespace-pre-wrap: Essential for code and text wrapping.
                // 3. [&_*]:break-all: Forces every internal element (p, span, code) to respect boundaries.
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[220px] p-6 focus:outline-none font-sans leading-relaxed break-all whitespace-pre-wrap [&_*]:break-all [&_pre]:break-all [&_code]:break-all',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(question.id, editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && answer !== editor.getHTML()) {
            editor.commands.setContent(answer, false);
        }
    }, [answer, editor]);

    if (!editor) return null;

    const isCodeMode = editor.isActive('codeBlock');
    const charCount = editor.storage.characterCount.characters();
    const progress = Math.min((charCount / MAX_CHARACTERS) * 100, 100);
    const isNearingLimit = charCount > MAX_CHARACTERS * 0.9;

    return (
        
        /* w-full + min-w-0 + table-fixed logic prevents the container from expanding */
        <div
            className={`flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                editor.isFocused
                    ? 'border-primary/40 shadow-xl ring-4 ring-primary/5'
                    : 'border-border/60 shadow-sm'
            } ${isCodeMode ? 'bg-zinc-950' : 'bg-background'}`}
        >
            <header
                className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 ${isCodeMode ? 'border-zinc-800 bg-zinc-900/40' : 'border-border/40 bg-muted/20'}`}
            >
                <HotToast position="top-right" reverseOrder={false} />
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${isCodeMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-primary text-primary-foreground'}`}
                    >
                        {isCodeMode ? (
                            <Code size={18} />
                        ) : (
                            <MessageSquareText size={18} />
                        )}
                    </div>
                    <div>
                        <Label className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                            {question.text ?? 'Question'}
                        </Label>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60 italic">
                            <AlertCircle
                                size={10}
                                className="text-orange-500"
                            />{' '}
                            No pasting allowed
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isCodeMode && (
                        <div className="flex items-center gap-0.5 rounded-lg bg-background/50 p-1 ring-1 ring-border/20">
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                active={editor.isActive('bold')}
                                icon={<Bold size={14} />}
                            />
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                active={editor.isActive('italic')}
                                icon={<Italic size={14} />}
                            />
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                active={editor.isActive('bulletList')}
                                icon={<List size={14} />}
                            />
                        </div>
                    )}
                    <div className="flex h-9 items-center rounded-xl border p-1">
                        <button
                            type="button"
                            onClick={() =>
                                isCodeMode &&
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={`flex items-center gap-1 rounded-lg px-4 py-1 text-xs font-bold ${!isCodeMode ? 'bg-background text-primary shadow' : 'text-muted-foreground'}`}
                        >
                            <Type size={14} /> Text
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                !isCodeMode &&
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={`flex items-center gap-1 rounded-lg px-4 py-1 text-xs font-bold ${isCodeMode ? 'bg-zinc-800 text-yellow-400' : 'text-muted-foreground'}`}
                        >
                            <Code size={14} /> Code
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative w-full min-w-0 flex-1 overflow-hidden">
                {isCodeMode && (
                    <div className="absolute top-4 right-6 z-10 flex items-center gap-3">
                        <Select
                            value={
                                editor.getAttributes('codeBlock').language ??
                                'javascript'
                            }
                            onValueChange={(language) =>
                                editor
                                    .chain()
                                    .focus()
                                    .updateAttributes('codeBlock', { language })
                                    .run()
                            }
                        >
                            <SelectTrigger className="h-7 w-[120px] bg-zinc-900 font-mono text-[10px] text-zinc-400">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 text-zinc-300">
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="font-mono text-xs"
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {/* min-w-0 is the secret sauce for flex containers to prevent content from pushing width */}
                <EditorContent className="w-full min-w-0" editor={editor} />
            </main>

            <footer className="flex items-center justify-between border-t px-6 py-4">
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div
                            className={`h-2 w-2 rounded-full ${isCodeMode ? 'bg-yellow-500' : 'bg-green-500'}`}
                        />
                        {isCodeMode ? 'Engine Active' : 'System Stable'}
                    </div>
                    <div className="flex items-center gap-1">
                        <Info size={12} /> Auto-save ON
                    </div>
                </div>
                <div className="flex min-w-[200px] flex-col items-end gap-2">
                    <div className="font-mono text-[10px]">
                        <span
                            className={
                                isNearingLimit
                                    ? 'font-bold text-destructive'
                                    : 'text-muted-foreground'
                            }
                        >
                            {charCount}
                        </span>
                        <span className="opacity-30"> / </span> {MAX_CHARACTERS}
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
                        <div
                            className={`h-full transition-all ${isNearingLimit ? 'bg-destructive' : isCodeMode ? 'bg-yellow-500' : 'bg-primary'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ToolbarButton({
    onClick,
    active,
    icon,
}: {
    onClick: () => void;
    active: boolean;
    icon: React.ReactNode;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={`h-7 w-7 ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
        >
            {icon}
        </Button>
    );
}
