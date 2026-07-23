import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import EmojiExtension, { shortcodesToUnicode } from './emojiExtension';
import IconButton from '../button/IconButton';
import Icon from '../ui/Icon';
import Dropdown from '../ui/Dropdown/Dropdown';
import { ReactNode, useEffect, useId, useRef, useState } from 'react';
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
  'data-testid'?: string;
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
  'data-testid': dataTestId,
}) => {
  const { t } = useTranslation();
  const generatedId = useId();
  const errorId = error ? `${generatedId}-error` : undefined;
  const helperId = !error && helperText ? `${generatedId}-helper` : undefined;
  const editorLabelId = label ? `${generatedId}-label` : undefined;
  const [isFocused, setIsFocused] = useState(false);
  const lastEmitted = useRef<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const emojiList = [
    { emoji: '😀', labelKey: 'smile' },
    { emoji: '😂', labelKey: 'laugh' },
    { emoji: '❤️', labelKey: 'heart' },
    { emoji: '👍', labelKey: 'thumbsUp' },
    { emoji: '🎉', labelKey: 'party' },
    { emoji: '✨', labelKey: 'sparkles' },
    { emoji: '🚀', labelKey: 'rocket' },
    { emoji: '💡', labelKey: 'bulb' },
    { emoji: '📝', labelKey: 'memo' },
    { emoji: '✅', labelKey: 'check' },
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
      EmojiExtension,
      Markdown,
    ],
    content: shortcodesToUnicode(value),
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.manager.serialize(editor.getJSON());
      lastEmitted.current = markdown;
      onChange(markdown);
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (!editor) return;
    const normalized = shortcodesToUnicode(value || '');
    if (normalized === lastEmitted.current) return;
    const current = editor.storage.markdown.manager.serialize(editor.getJSON());
    if (normalized !== current) {
      editor.commands.setContent(normalized);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          role: 'textbox',
          'aria-multiline': 'true',
          ...(editorLabelId ? { 'aria-labelledby': editorLabelId } : { 'aria-label': t('v2.ui.editor.label') }),
          ...(required ? { 'aria-required': 'true' } : {}),
          ...(error ? { 'aria-invalid': 'true' } : {}),
          ...(errorId || helperId ? { 'aria-describedby': [errorId, helperId].filter(Boolean).join(' ') } : {}),
          'aria-keyshortcuts':
            'Control+B Control+I Control+Shift+S Control+Shift+7 Control+Shift+8 Control+Z Control+Shift+Z',
        },
      },
    });
  }, [editor, editorLabelId, required, error, errorId, helperId, t]);

  // Read the state reactively — v3 doesn't re-render on transactions by default.
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      charCount: editor?.getText().length ?? 0,
      bold: editor?.isActive('bold') ?? false,
      italic: editor?.isActive('italic') ?? false,
      strike: editor?.isActive('strike') ?? false,
      bulletList: editor?.isActive('bulletList') ?? false,
      orderedList: editor?.isActive('orderedList') ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  });
  const charCount = editorState?.charCount ?? 0;

  if (!editor) {
    return null;
  }

  const insertEmoji = (emoji: string) => {
    editor.commands.insertContent(emoji);
  };

  const handleToolbarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = Array.from(
      toolbarRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []
    ).filter((button) => !button.closest('[data-dropdown-panel]'));
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : event.key === 'ArrowRight'
            ? (current + 1) % buttons.length
            : (current - 1 + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  const hasContent = charCount > 0;

  return (
    <div className="relative flex flex-col w-full">
      <div
        className={twMerge(
          'flex flex-col rounded-lg border border-input-border bg-transparent shadow-inner',
          'transition-colors duration-200',
          'hover:border-input-border-hover focus-within:outline-1',
          error
            ? 'border-error-fg focus-within:outline-error-fg'
            : 'focus-within:border-current focus-within:ring-current',
          disabled ? 'cursor-not-allowed opacity-50' : ''
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div
          ref={toolbarRef}
          className="relative flex items-center gap-1 px-2 py-1 border-b border-input-border"
          role="toolbar"
          aria-label={t('v2.ui.editor.toolbar')}
          onKeyDown={handleToolbarKeyDown}
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
            aria-label={t('v2.ui.editor.bold')}
            aria-pressed={editorState?.bold ?? false}
            tabIndex={0}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="bold" size="1.25rem" />
          </IconButton>

          <IconButton
            type="button"
            onClick={() => editor.commands.toggleItalic()}
            disabled={disabled}
            aria-label={t('v2.ui.editor.italic')}
            aria-pressed={editorState?.italic ?? false}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="italic" size="1.25rem" />
          </IconButton>

          <IconButton
            type="button"
            onClick={() => editor.commands.toggleStrike()}
            disabled={disabled}
            aria-label={t('v2.ui.editor.strikethrough')}
            aria-pressed={editorState?.strike ?? false}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="strikethrough" size="1.25rem" />
          </IconButton>

          <div className="h-5 w-px bg-input-border" aria-hidden="true"></div>

          <IconButton
            type="button"
            onClick={() => editor.commands.toggleBulletList()}
            disabled={disabled}
            aria-label={t('v2.ui.editor.bulletList')}
            aria-pressed={editorState?.bulletList ?? false}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="list" size="1.25rem" />
          </IconButton>

          <IconButton
            type="button"
            onClick={() => editor.commands.toggleOrderedList()}
            disabled={disabled}
            aria-label={t('v2.ui.editor.orderedList')}
            aria-pressed={editorState?.orderedList ?? false}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="numbered" size="1.25rem" />
          </IconButton>

          <div className="h-5 w-px bg-input-border" aria-hidden="true"></div>

          <Dropdown
            role="dialog"
            aria-label={t('v2.ui.editor.emoji')}
            content={
              <div className="grid grid-cols-5 gap-1 p-2">
                {emojiList.map(({ emoji, labelKey }) => (
                  <IconButton
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    aria-label={t(`v2.ui.editor.emojis.${labelKey}`)}
                    className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
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
              aria-label={t('v2.ui.editor.emoji')}
              tabIndex={-1}
              className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
            >
              😀
            </IconButton>
          </Dropdown>

          <div className="h-5 w-px bg-input-border mr-auto" aria-hidden="true"></div>

          <IconButton
            type="button"
            onClick={() => editor.commands.undo()}
            disabled={disabled || !(editorState?.canUndo ?? false)}
            aria-label={t('v2.ui.editor.undo')}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="undo" size="1.25rem" />
          </IconButton>

          <IconButton
            type="button"
            onClick={() => editor.commands.redo()}
            disabled={disabled || !(editorState?.canRedo ?? false)}
            aria-label={t('v2.ui.editor.redo')}
            tabIndex={-1}
            className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
          >
            <Icon type="redo" size="1.25rem" />
          </IconButton>
        </div>

        <EditorContent
          editor={editor}
          data-testid={dataTestId}
          className={`max-w-none p-3 pb-0 [&_div[contenteditable]:focus]:outline-none shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        />
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
