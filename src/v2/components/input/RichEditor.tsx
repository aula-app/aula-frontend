import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Emoji } from '@tiptap/extension-emoji';
import IconButton from '../button/IconButton';
import Icon from '../ui/Icon';
import Dropdown from '../ui/Dropdown/Dropdown';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  disabled = false,
  maxLength = 1000,
  placeholder = 'Enter content...',
}) => {
  const emojiList = [
    { emoji: '😀', label: 'Smiling face' },
    { emoji: '😂', label: 'Laughing face' },
    { emoji: '❤️', label: 'Red heart' },
    { emoji: '👍', label: 'Thumbs up' },
    { emoji: '🎉', label: 'Party popper' },
    { emoji: '✨', label: 'Sparkles' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '💡', label: 'Light bulb' },
    { emoji: '📝', label: 'Memo' },
    { emoji: '✅', label: 'Check mark' },
  ];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside mb-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside mb-2',
          },
        },
      }),
      Emoji,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  const insertEmoji = (emoji: string) => {
    editor.commands.insertContent(emoji);
  };

  const toggleBold = () => editor.commands.toggleBold();
  const toggleItalic = () => editor.commands.toggleItalic();
  const toggleBulletList = () => editor.commands.toggleBulletList();
  const toggleOrderedList = () => editor.commands.toggleOrderedList();

  const charCount = editor.getText().length;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 rounded-t-lg border border-muted border-b-0">
        <IconButton type="button" onClick={toggleBold} disabled={disabled} aria-label="Bold">
          <Icon type="bold" size="1.25rem" />
        </IconButton>

        <IconButton type="button" onClick={toggleItalic} disabled={disabled} aria-label="Italic">
          <Icon type="italic" size="1.25rem" />
        </IconButton>

        <div className="h-6 w-px bg-muted"></div>

        <IconButton type="button" onClick={toggleBulletList} disabled={disabled} aria-label="Bullet list">
          <Icon type="list" size="1.25rem" />
        </IconButton>

        <IconButton type="button" onClick={toggleOrderedList} disabled={disabled} aria-label="Ordered list">
          <Icon type="numbered" size="1.25rem" />
        </IconButton>

        <div className="h-6 w-px bg-muted"></div>

        <Dropdown
          aria-label="Add emoji"
          content={
            <div className="grid grid-cols-5 gap-1 p-2">
              {emojiList.map(({ emoji, label }) => (
                <IconButton
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  aria-label={label}
                >
                  {emoji}
                </IconButton>
              ))}
            </div>
          }
        >
          <IconButton type="button" disabled={disabled} aria-label="Add emoji">
            😀
          </IconButton>
        </Dropdown>
      </div>

      <EditorContent
        editor={editor}
        className={`prose prose-sm max-w-none rounded-b-lg border border-muted p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
          disabled ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'bg-white'
        }`}
      />

      <div className="flex justify-between text-xs text-muted">
        <span></span>
        <span>
          {charCount} / {maxLength}
        </span>
      </div>
    </div>
  );
};

export default RichEditor;
