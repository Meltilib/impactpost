'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, 
  Heading2, Heading3, Quote, ImageIcon, Link as LinkIcon,
  Type, MessageSquareQuote, CheckSquare, AlertCircle
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { StyledQuoteExtension, KeyTakeawaysExtension, CalloutBoxExtension, LeadParagraphExtension } from '@/lib/admin/tiptap-extensions';

interface RichEditorProps {
  content?: string;
  initialDoc?: Record<string, unknown>;
  onChange: (content: string, json: unknown) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
}

export function RichEditor({ content, initialDoc, onChange, onImageUpload }: RichEditorProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showTakeawaysModal, setShowTakeawaysModal] = useState(false);
  const [showCalloutModal, setShowCalloutModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-purple underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      StyledQuoteExtension,
      KeyTakeawaysExtension,
      CalloutBoxExtension,
      LeadParagraphExtension,
    ],
    content: initialDoc || content || { type: 'doc', content: [{ type: 'paragraph', content: [] }] },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Update editor content when content prop changes and sync initial value back up
  const hasSyncedInitial = useRef(false);
  useEffect(() => {
    if (!editor) return;

    const needsSetContent = content && content !== editor.getHTML();
    if (needsSetContent) {
      editor.commands.setContent(content);
    }

    if (!hasSyncedInitial.current || needsSetContent) {
      onChange(editor.getHTML(), editor.getJSON());
      hasSyncedInitial.current = true;
    }
  }, [editor, content, onChange]);

  // Sync initialDoc to editor when editor is ready (handles SSR hydration timing)
  useEffect(() => {
    if (!editor || !initialDoc) return;

    // Check if editor is empty (only has placeholder content)
    const currentJson = editor.getJSON();
    const hasRealContent = currentJson.content?.some((node: Record<string, unknown>) => {
      if (node.type !== 'paragraph') return true;
      const nodeContent = node.content as Array<{ text?: string }> | undefined;
      return nodeContent?.some((child) => child.text && child.text.trim().length > 0);
    });

    // If editor is empty but initialDoc has content, set it
    const initialContent = initialDoc.content as unknown[] | undefined;
    if (!hasRealContent && initialContent && initialContent.length > 0) {
      editor.commands.setContent(initialDoc);
    }
  }, [editor, initialDoc]);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageUpload) {
        const url = await onImageUpload(file);
        if (url && editor) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const insertLeadParagraph = useCallback((text: string) => {
    if (editor && text) {
      editor.chain().focus().insertContent({
        type: 'leadParagraph',
        content: [{ type: 'text', text }],
      }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-2 border-black bg-white">
      {/* Toolbar */}
      <div className="border-b-2 border-black p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* Text formatting */}
        <div className="flex gap-1 pr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={18} />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 px-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 px-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </ToolbarButton>
        </div>

        {/* Quote and Media */}
        <div className="flex gap-1 px-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Insert Image">
            <ImageIcon size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link">
            <LinkIcon size={18} />
          </ToolbarButton>
        </div>

        {/* Custom blocks */}
        <div className="flex gap-1 px-2">
          <ToolbarButton onClick={() => setShowLeadModal(true)} title="Lead Paragraph (Drop Cap)">
            <Type size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setShowQuoteModal(true)} title="Featured Quote">
            <MessageSquareQuote size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setShowTakeawaysModal(true)} title="Key Takeaways">
            <CheckSquare size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setShowCalloutModal(true)} title="Callout Box">
            <AlertCircle size={18} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Modals for custom blocks */}
      {showQuoteModal && (
        <QuoteModal
          onClose={() => setShowQuoteModal(false)}
          onInsert={(quote, attribution, style) => {
            editor.chain().focus().insertContent({
              type: 'styledQuote',
              attrs: { quote, attribution, style },
            }).run();
            setShowQuoteModal(false);
          }}
        />
      )}

      {showTakeawaysModal && (
        <TakeawaysModal
          onClose={() => setShowTakeawaysModal(false)}
          onInsert={(items) => {
            editor.chain().focus().insertContent({
              type: 'keyTakeaways',
              attrs: { items },
            }).run();
            setShowTakeawaysModal(false);
          }}
        />
      )}

      {showLeadModal && (
        <LeadParagraphModal
          onClose={() => setShowLeadModal(false)}
          onInsert={(text) => {
            insertLeadParagraph(text);
            setShowLeadModal(false);
          }}
        />
      )}

      {showCalloutModal && (
        <CalloutModal
          onClose={() => setShowCalloutModal(false)}
          onInsert={(title, content, variant) => {
            editor.chain().focus().insertContent({
              type: 'calloutBox',
              attrs: { title, content, variant },
            }).run();
            setShowCalloutModal(false);
          }}
        />
      )}
    </div>
  );
}

function ToolbarButton({ 
  children, 
  onClick, 
  isActive = false, 
  title 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  isActive?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? 'bg-brand-purple text-white hover:bg-brand-purple/90' : ''
      }`}
    >
      {children}
    </button>
  );
}

function QuoteModal({ 
  onClose, 
  onInsert 
}: { 
  onClose: () => void; 
  onInsert: (quote: string, attribution: string, style: string) => void;
}) {
  const [quote, setQuote] = useState('');
  const [attribution, setAttribution] = useState('');
  const [style, setStyle] = useState('teal');

  return (
    <Modal title="Featured Quote" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Quote Text *</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full border-2 border-black p-2 min-h-[100px]"
            placeholder="Enter the quote..."
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Attribution (optional)</label>
          <input
            type="text"
            value={attribution}
            onChange={(e) => setAttribution(e.target.value)}
            className="w-full border-2 border-black p-2"
            placeholder="e.g., Community Leader"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Style</label>
          <div className="flex gap-4">
            {['teal', 'coral', 'purple'].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="style"
                  value={s}
                  checked={style === s}
                  onChange={(e) => setStyle(e.target.value)}
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onInsert(quote, attribution, style)}
            disabled={!quote}
            className="px-4 py-2 bg-brand-purple text-white font-bold disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TakeawaysModal({ 
  onClose, 
  onInsert 
}: { 
  onClose: () => void; 
  onInsert: (items: string[]) => void;
}) {
  const [items, setItems] = useState(['']);

  const addItem = () => setItems([...items, '']);
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <Modal title="Key Takeaways" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-gray-600">Add bullet points for key takeaways:</p>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="mt-2">•</span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 border-2 border-black p-2"
              placeholder="Enter takeaway point..."
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-2 text-red-500 hover:bg-red-50"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-brand-purple font-bold hover:underline"
        >
          + Add More
        </button>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onInsert(items.filter(Boolean))}
            disabled={!items.some(Boolean)}
            className="px-4 py-2 bg-brand-purple text-white font-bold disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CalloutModal({ 
  onClose, 
  onInsert 
}: { 
  onClose: () => void; 
  onInsert: (title: string, content: string, variant: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [variant, setVariant] = useState('info');

  return (
    <Modal title="Callout Box" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-black p-2"
            placeholder="e.g., Important Note"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-2 border-black p-2 min-h-[100px]"
            placeholder="Enter callout content..."
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Variant</label>
          <div className="flex gap-4">
            {['info', 'warning', 'success'].map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="variant"
                  value={v}
                  checked={variant === v}
                  onChange={(e) => setVariant(e.target.value)}
                />
                <span className="capitalize">{v}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onInsert(title, content, variant)}
            disabled={!content}
            className="px-4 py-2 bg-brand-purple text-white font-bold disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}

function LeadParagraphModal({
  onClose,
  onInsert,
}: {
  onClose: () => void;
  onInsert: (text: string) => void;
}) {
  const [text, setText] = useState('');

  return (
    <Modal title="Lead Paragraph" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-gray-600">Add an intro paragraph with a drop cap.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border-2 border-black p-3 min-h-[120px]"
          placeholder="Type your lead paragraph..."
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-black hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onInsert(text)}
            disabled={!text.trim()}
            className="px-4 py-2 bg-brand-purple text-white font-bold disabled:opacity-50"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ 
  title, 
  children, 
  onClose 
}: { 
  title: string; 
  children: React.ReactNode; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black shadow-hard w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b-2 border-black">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
