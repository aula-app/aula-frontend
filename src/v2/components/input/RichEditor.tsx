import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Emoji } from '@tiptap/extension-emoji';
import { Markdown } from '@tiptap/markdown';
import IconButton from '../button/IconButton';
import Icon from '../ui/Icon';
import Dropdown from '../ui/Dropdown/Dropdown';
import { ReactNode, useId, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string | ReactNode;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  disabled = false,
  maxLength = 1000,
  label,
  required = false,
  error,
  helperText,
}) => {
  const { t } = useTranslation();
  const generatedId = useId();
  const errorId = error ? `${generatedId}-error` : undefined;
  const helperId = !error && helperText ? `${generatedId}-helper` : undefined;
  const [isFocused, setIsFocused] = useState(false);

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
      Markdown,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.manager.serialize(editor.getJSON());
      onChange(markdown);
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  const insertEmoji = (emoji: string) => {
    editor.commands.insertContent(emoji);
  };

  const charCount = editor.getText().length;
  const hasContent = charCount > 0;
  const editorLabelId = label ? `${generatedId}-label` : undefined;

  return (
    <div className="flex flex-col w-full mb-3">
      <div className="relative">
        <div
          className={twMerge(
            'flex flex-col rounded-lg border border-input-border bg-transparent shadow-inner',
            'transition-colors duration-200',
            'hover:border-input-border-hover',
            error
              ? 'border-error focus-within:border-error'
              : 'focus-within:border-current focus-within:ring-2 focus-within:ring-current',
            disabled ? 'cursor-not-allowed opacity-50' : ''
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div
            className="relative flex items-center gap-1 px-2 py-1 border-b border-input-border"
            role="toolbar"
            aria-label="Text formatting"
          >
            {label && (
              <label
                id={editorLabelId}
                className={twMerge(
                  'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 origin-left text-sm transition-all duration-200',
                  'bg-background px-0.5',
                  hasContent || isFocused ? 'top-0 -translate-y-1/2 scale-75' : 'top-full translate-y-2/3 scale-100',
                  error ? 'text-error-fg' : 'text-muted'
                )}
              >
                {label}
                {required && (
                  <>
                    <span aria-hidden="true" className="ml-0.5">
                      *
                    </span>
                    <span className="sr-only">{t('v2.form.validation.required')}</span>
                  </>
                )}
              </label>
            )}

            <IconButton
              type="button"
              onClick={() => editor.commands.toggleBold()}
              disabled={disabled}
              aria-label="Bold"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="bold" size="1.25rem" />
            </IconButton>

            <IconButton
              type="button"
              onClick={() => editor.commands.toggleItalic()}
              disabled={disabled}
              aria-label="Italic"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="italic" size="1.25rem" />
            </IconButton>

            <IconButton
              type="button"
              onClick={() => editor.commands.toggleStrike()}
              disabled={disabled}
              aria-label="Strikethrough"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="strikethrough" size="1.25rem" />
            </IconButton>

            <div className="h-5 w-px bg-input-border" aria-hidden="true"></div>

            <IconButton
              type="button"
              onClick={() => editor.commands.toggleBulletList()}
              disabled={disabled}
              aria-label="Bullet list"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="list" size="1.25rem" />
            </IconButton>

            <IconButton
              type="button"
              onClick={() => editor.commands.toggleOrderedList()}
              disabled={disabled}
              aria-label="Ordered list"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="numbered" size="1.25rem" />
            </IconButton>

            <div className="h-5 w-px bg-input-border" aria-hidden="true"></div>

            <Dropdown
              aria-label="Add emoji"
              content={
                <div className="grid grid-cols-5 gap-1 p-2">
                  {emojiList.map(({ emoji, label: emojiLabel }) => (
                    <IconButton
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      aria-label={emojiLabel}
                      className="min-h-11 min-w-11"
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </div>
              }
            >
              <IconButton
                type="button"
                disabled={disabled}
                aria-label="Add emoji"
                tabIndex={-1}
                className="min-h-11 min-w-11"
              >
                😀
              </IconButton>
            </Dropdown>

            <div className="h-5 w-px bg-input-border mr-auto" aria-hidden="true"></div>

            <IconButton
              type="button"
              onClick={() => editor.commands.undo()}
              disabled={disabled || !editor.can().undo()}
              aria-label="Undo"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="undo" size="1.25rem" />
            </IconButton>

            <IconButton
              type="button"
              onClick={() => editor.commands.redo()}
              disabled={disabled || !editor.can().redo()}
              aria-label="Redo"
              tabIndex={-1}
              className="min-h-11 min-w-11"
            >
              <Icon type="redo" size="1.25rem" />
            </IconButton>
          </div>

          <EditorContent
            editor={editor}
            className={`max-w-none p-3 pb-0 [&_div[contenteditable]:focus]:outline-none shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
            aria-label={label || 'Rich text editor'}
            aria-labelledby={editorLabelId}
            aria-required={required}
            aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          />
        </div>
      </div>

      <div className="pt-1 px-1">
        {error ? (
          <span id={errorId} className="flex text-xs text-error-fg">
            <Icon type="alert" className="inline-block mr-1 mb-0.5" size="1em" />
            {error}
          </span>
        ) : (
          <span id={helperId} className="flex text-xs text-muted justify-between" aria-live="polite" aria-atomic="true">
            <span>
              {charCount} / {maxLength}
            </span>
            {helperText && <span>{helperText}</span>}
          </span>
        )}
      </div>
    </div>
  );
};

export default RichEditor;
