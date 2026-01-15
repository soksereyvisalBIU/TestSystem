'use client';

import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { Plugin } from 'prosemirror-state';
import { useEffect, useRef } from 'react';

// UI
import { Label } from '@/components/ui/label';

import { AlertCircle, Info } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const lowlight = createLowlight(common);
const MAX_CHARACTERS = 2000;

/* -------------------------------------------------------------------------- */
/*                         STRICT PASTE / DROP BLOCKER                         */
/* -------------------------------------------------------------------------- */

const DisablePaste = Extension.create({
    name: 'disablePaste',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste(_, event) {
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

/* -------------------------------------------------------------------------- */
/*                              SECURITY HELPERS                               */
/* -------------------------------------------------------------------------- */

function hasCodeBlock(html: string) {
    return /<pre><code[\s\S]*?<\/code><\/pre>/i.test(html);
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface Props {
    question: { id: number | string; text?: string };
    answer: string;
    onChange: (questionId: number | string, value: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function TiptapShortAnswer({
    question,
    answer,
    onChange,
}: Props) {
    // ✅ FIX: ensure restore runs ONLY ONCE
    const hydratedRef = useRef(false);

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
                        ? '// Type your code manually (paste disabled)'
                        : 'Explain your reasoning... (paste disabled)',
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[220px] p-6 focus:outline-none font-sans leading-relaxed selection:bg-primary/30',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(question.id, editor.getHTML());
        },
    });

    /* ---------------------------------------------------------------------- */
    /*   ✅ FIX: RESTORE ANSWER SAFELY (LOCALSTORAGE / SERVER)                  */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (!editor || hydratedRef.current) return;

        if (!answer) {
            hydratedRef.current = true;
            return;
        }

        if (hasCodeBlock(answer)) {
            console.warn(
                `[Exam] Blocked restored code for question ${question.id}`,
            );
            hydratedRef.current = true;
            return;
        }

        editor.commands.setContent(answer, false); // ✅ correct restore
        hydratedRef.current = true;
    }, [editor, answer, question.id]);

    if (!editor) return null;

    const isCodeMode = editor.isActive('codeBlock');
    const charCount = editor.storage.characterCount.characters();
    const progress = Math.min((charCount / MAX_CHARACTERS) * 100, 100);
    const isNearingLimit = charCount > MAX_CHARACTERS * 0.9;
    const isFocused = editor.isFocused;

    /* ---------------------------------------------------------------------- */

    return (
        <div
            className={`flex w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                isFocused
                    ? 'border-primary/40 shadow-xl ring-4 ring-primary/5'
                    : 'border-border/60 shadow-sm'
            } ${isCodeMode ? 'bg-zinc-950' : 'bg-background'}`}
        >
            {/* TOOLBAR */}
            <header className="flex items-center justify-between border-b px-5 py-3">
                <Label className="text-xs">{question.text}</Label>
                <AlertCircle size={12} className="text-orange-500" />
            </header>

            {/* EDITOR */}
            <EditorContent editor={editor} />

            {/* FOOTER */}
            <footer className="flex justify-between border-t px-6 py-4 text-xs">
                <span>
                    {charCount} / {MAX_CHARACTERS}
                </span>
                <Info size={12} />
            </footer>
        </div>
    );
}
