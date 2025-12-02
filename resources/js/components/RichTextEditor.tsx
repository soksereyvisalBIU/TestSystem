import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';

type Props = {
  value?: string;
  onChange?: (content: string) => void;
};

const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  label,
  className = '',
}: {
  onClick?: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300' : ''} ${className}`}
  >
    {icon}
  </button>
);

const RichTextEditor: React.FC<Props> = ({ value = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-[200px] p-3 focus:outline-none dark:prose-invert',
      },
    },
  });

  if (!editor) return null;

  // Insert link
  const setLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  // Insert image
  const addImage = () => {
    const url = prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Heading selector
  const HeadingDropdown = () => (
    <select
      className="border text-sm rounded p-1 bg-white"
      onChange={(e) => {
        const level = e.target.value;
        if (level === 'paragraph') editor.chain().focus().setParagraph().run();
        else editor.chain().focus().toggleHeading({ level: Number(level) }).run();
      }}
      value={
        editor.isActive('heading', { level: 1 })
          ? '1'
          : editor.isActive('heading', { level: 2 })
          ? '2'
          : editor.isActive('heading', { level: 3 })
          ? '3'
          : 'paragraph'
      }
    >
      <option value="paragraph">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
    </select>
  );

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-900">
      {/* Menu Bar */}
      <div className="flex space-x-4 px-2 py-1 text-sm border-b border-gray-200 dark:border-gray-700">
        {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Table', 'Help'].map((item) => (
          <span key={item} className="cursor-pointer hover:underline">
            {item}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Undo" icon="↩" />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="Redo" icon="↪" />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <HeadingDropdown />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          label="Bold"
          icon={<span className="font-bold">B</span>}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          label="Italic"
          icon={<span className="italic">I</span>}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          label="Underline"
          icon={<span className="underline">U</span>}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          label="Highlight"
          icon={<span className="bg-yellow-300 px-1">A</span>}
        />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          label="Align Left"
          icon="☰"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          label="Align Center"
          icon="≡"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          label="Align Right"
          icon="≣"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          label="Justify"
          icon="▤"
        />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          label="Bullet List"
          icon="•"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          label="Numbered List"
          icon="1."
        />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <ToolbarButton onClick={setLink} label="Insert Link" icon="🔗" />
        <ToolbarButton onClick={addImage} label="Insert Image" icon="🏞" />

        <div className="h-5 w-px bg-gray-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          label="Clear Formatting"
          icon="⌫"
        />
      </div>

      {/* Editor Area */}
      <div className="min-h-[200px] bg-white dark:bg-gray-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
