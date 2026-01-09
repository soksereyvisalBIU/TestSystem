import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';

// UI & Icons
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
    Bold,
    Code,
    Italic,
    List,
    MessageSquareText,
    Settings2,
    Sparkles,
    Type,
} from 'lucide-react';

const lowlight = createLowlight(common);
const MAX_CHARACTERS = 2000;

const LANGUAGE_OPTIONS = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'C++', value: 'cpp' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
];

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
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({ lowlight }),
            CharacterCount.configure({ limit: MAX_CHARACTERS }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    return node.type.name === 'codeBlock'
                        ? '// Type your technical implementation here...'
                        : 'Explain your thought process...';
                },
            }),
        ],
        content: answer,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-6 font-sans transition-all',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(question.id, editor.getHTML());
        },
    });

    if (!editor) return null;

    const isCodeMode = editor.isActive('codeBlock');
    const charCount = editor.storage.characterCount.characters();
    const progress = (charCount / MAX_CHARACTERS) * 100;
    const isNearingLimit = charCount > MAX_CHARACTERS * 0.9;

    return (
        <div className="group w-full overflow-hidden rounded-3xl border border-border/50 bg-background shadow-2xl transition-all duration-300 hover:border-primary/30">
            {/* --- TOP TOOLBAR --- */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-muted/20 px-5 py-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${isCodeMode ? 'bg-zinc-900 text-yellow-400' : 'bg-primary text-primary-foreground'}`}
                    >
                        {isCodeMode ? (
                            <Code size={16} />
                        ) : (
                            <MessageSquareText size={16} />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <Label className="text-[11px] font-bold tracking-widest text-muted-foreground/80 uppercase">
                            {question.text || 'Technical Task'}
                        </Label>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Formatting Controls (Only shown when NOT in code mode) */}
                    {!isCodeMode && (
                        <div className="mr-2 flex items-center gap-1 rounded-md bg-background/50 p-1 shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                className={`h-7 w-7 ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <Bold size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                className={`h-7 w-7 ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <Italic size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className={`h-7 w-7 ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <List size={14} />
                            </Button>
                        </div>
                    )}

                    {/* Mode Switcher Toggle */}
                    <div className="flex h-9 items-center gap-1 rounded-xl border bg-muted/50 p-1">
                        <button
                            onClick={() =>
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                !isCodeMode
                                    ? 'bg-background text-primary shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Type size={14} /> Text
                        </button>
                        <button
                            onClick={() =>
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                isCodeMode
                                    ? 'bg-zinc-900 text-yellow-400 shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Code size={14} /> Code
                        </button>
                    </div>
                </div>
            </div>

            {/* --- EDITOR CONTENT AREA --- */}
            <div
                className={`relative transition-all duration-500 ${isCodeMode ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-background'}`}
            >
                {/* Language Picker Floating Badge */}
                {isCodeMode && (
                    <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-tighter text-zinc-500 uppercase">
                            <Sparkles size={10} /> Syntax
                        </span>
                        <Select
                            value={
                                editor.getAttributes('codeBlock').language ||
                                'javascript'
                            }
                            onValueChange={(val) =>
                                editor
                                    .chain()
                                    .focus()
                                    .updateAttributes('codeBlock', {
                                        language: val,
                                    })
                                    .run()
                            }
                        >
                            <SelectTrigger className="h-7 border-zinc-800 bg-zinc-900/50 font-mono text-[11px] text-zinc-300">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-200">
                                {LANGUAGE_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                    >
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div
                    className={
                        isCodeMode
                            ? 'selection:bg-yellow-500/30'
                            : 'selection:bg-primary/20'
                    }
                >
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* --- FOOTER STATUS BAR --- */}
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/10 px-6 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div
                            className={`h-2 w-2 rounded-full ${isCodeMode ? 'animate-pulse bg-yellow-500' : 'bg-green-500'}`}
                        />
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                            {isCodeMode
                                ? 'Logic Engine Active'
                                : 'Rich Text Ready'}
                        </span>
                    </div>
                    <div className="h-4 w-px bg-border/60" />
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 italic">
                        <Settings2 size={12} />
                        Auto-save enabled
                    </div>
                </div>

                <div className="flex min-w-[150px] flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span
                            className={
                                isNearingLimit
                                    ? 'font-bold text-destructive'
                                    : 'text-muted-foreground'
                            }
                        >
                            {charCount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground/30">/</span>
                        <span className="text-muted-foreground/70">
                            {MAX_CHARACTERS.toLocaleString()} chars
                        </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${
                                isNearingLimit
                                    ? 'bg-destructive'
                                    : isCodeMode
                                      ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                                      : 'bg-primary'
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
