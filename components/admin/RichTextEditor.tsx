"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
        active
          ? "bg-[#264653] text-white"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeight = "150px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#2A9D8F] underline" },
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  if (!editor) return null;

  function handleLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#2A9D8F] focus-within:border-transparent">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Subheading"
          >
            H3
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <u>U</u>
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            1. List
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={handleLink}
            active={editor.isActive("link")}
            title="Link"
          >
            🔗
          </ToolbarButton>
        </div>

        {/* Editor area — styled to match the website */}
        <div
          className="rich-editor-content px-4 py-3 bg-white"
          style={{ minHeight }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {placeholder && !value && (
        <p className="text-xs text-gray-400 mt-1">{placeholder}</p>
      )}

      {/* Styles that match the public site */}
      <style>{`
        .rich-editor-content .tiptap {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
          color: #1A1A1A;
          line-height: 1.7;
          font-size: 1rem;
        }
        .rich-editor-content .tiptap:focus {
          outline: none;
        }
        .rich-editor-content .tiptap p {
          margin-bottom: 0.75rem;
        }
        .rich-editor-content .tiptap h2 {
          font-family: "Playfair Display", ui-serif, Georgia, serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #264653;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }
        .rich-editor-content .tiptap h3 {
          font-family: "Playfair Display", ui-serif, Georgia, serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #264653;
          margin-bottom: 0.5rem;
          margin-top: 1.25rem;
        }
        .rich-editor-content .tiptap ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-editor-content .tiptap ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .rich-editor-content .tiptap li {
          margin-bottom: 0.25rem;
        }
        .rich-editor-content .tiptap a {
          color: #2A9D8F;
          text-decoration: underline;
        }
        .rich-editor-content .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
