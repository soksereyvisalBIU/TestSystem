import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { common, createLowlight } from 'lowlight';

// UI & Icons
import { Label } from '@/components/ui/label';
import { 
    Code2, 
    Type, 
    Terminal, 
    Sparkles, 
    Info, 
    Heading2, 
    List as ListIcon, 
    Bold as BoldIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const lowlight = createLowlight(common);

interface Props {
    data: any; // { question: string, answer: string, type: 'text' | 'code' }
    onChange: (data: any) => void;
}

export default function ShortAnswerForm({ data, onChange }: Props) {
    const mode = data.type === 'code' ? 'code' : 'text';

    // 1. Editor for the Question Prompt
    const questionEditor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: 'Enter your question prompt here...' }),
        ],
        content: data.question || '',
        onUpdate: ({ editor }) => {
            onChange({ ...data, question: editor.getHTML() });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-4 font-sans',
            },
        },
    });

    // 2. Editor for the Reference Answer
    const answerEditor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            CodeBlockLowlight.configure({ lowlight }),
            Placeholder.configure({ placeholder: 'Enter the ideal reference answer...' }),
        ],
        content: data.answer || '',
        onUpdate: ({ editor }) => {
            onChange({ ...data, answer: editor.getHTML() });
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 font-mono',
            },
        },
    });

    const toggleMode = (newMode: 'text' | 'code') => {
        onChange({ ...data, type: newMode });
        if (newMode === 'code') {
            answerEditor?.chain().focus().setCodeBlock().run();
        } else {
            answerEditor?.chain().focus().toggleCodeBlock().run();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* --- HEADER & MODE SELECTOR --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        Question Architect
                    </h3>
                </div>

                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
                    <button
                        onClick={() => toggleMode('text')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            mode === 'text' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Type size={14} /> Conceptual
                    </button>
                    <button
                        onClick={() => toggleMode('code')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                            mode === 'code' ? "bg-zinc-900 text-yellow-400 shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Code2 size={14} /> Technical
                    </button>
                </div>
            </div>

            {/* --- QUESTION EDITOR --- */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">The Prompt</Label>
                    <div className="flex gap-1">
                        <EditorToolbarButton onClick={() => questionEditor?.chain().focus().toggleHeading({ level: 2 }).run()} icon={<Heading2 size={14}/>} />
                        <EditorToolbarButton onClick={() => questionEditor?.chain().focus().toggleBold().run()} icon={<BoldIcon size={14}/>} />
                        <EditorToolbarButton onClick={() => questionEditor?.chain().focus().toggleBulletList().run()} icon={<ListIcon size={14}/>} />
                    </div>
                </div>
                <div className="rounded-2xl border-2 border-border bg-card focus-within:border-primary/30 transition-all overflow-hidden shadow-sm">
                    <EditorContent editor={questionEditor} />
                </div>
            </div>

            {/* --- REFERENCE ANSWER EDITOR --- */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Terminal className={cn("w-3.5 h-3.5", mode === 'code' ? "text-yellow-500" : "text-primary")} />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Grading Guide / Reference</Label>
                </div>

                <div className={cn(
                    "rounded-2xl border-2 transition-all duration-500 overflow-hidden",
                    mode === 'code' ? "bg-zinc-950 border-zinc-800" : "bg-muted/20 border-border"
                )}>
                    <div className={cn(
                        "px-4 py-2 border-b flex items-center justify-between",
                        mode === 'code' ? "bg-zinc-900/50 border-zinc-800" : "bg-muted/50 border-border"
                    )}>
                        <div className="flex items-center gap-2">
                            <Sparkles size={12} className={mode === 'code' ? "text-yellow-500" : "text-primary"} />
                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                {mode === 'code' ? 'Code Environment' : 'Standard Response'}
                            </span>
                        </div>
                    </div>
                    
                    <EditorContent editor={answerEditor} />
                </div>
            </div>

            {/* --- CONTEXTUAL FOOTER --- */}
            <div className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border transition-all",
                mode === 'code' ? "bg-yellow-500/5 border-yellow-500/10" : "bg-primary/5 border-primary/10"
            )}>
                <Info className={cn("w-4 h-4 mt-0.5", mode === 'code' ? "text-yellow-600" : "text-primary")} />
                <div className="text-[11px] leading-relaxed text-muted-foreground">
                    <p>
                        <strong className="uppercase tracking-tight mr-1 text-foreground">Creator Insight:</strong>
                        {mode === 'code' 
                            ? "This solution will be syntax-highlighted for the evaluator. Ensure you include comments explaining complex logic." 
                            : "Rich text formatting is enabled. Use bolding to highlight key phrases students must include to earn full points."}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Sub-component for a clean toolbar look
function EditorToolbarButton({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
            {icon}
        </button>
    );
}