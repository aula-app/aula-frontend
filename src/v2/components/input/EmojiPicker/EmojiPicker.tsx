import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../ui/Dropdown/Dropdown';
import IconButton from '../../button/IconButton';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
  className?: string;
  tabIndex?: number;
}

const COLUMNS = 5;

const EMOJIS = [
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

/** Next focus index for a 2D grid; Left/Right wrap across the whole list, Up/Down wrap by column. */
const nextIndex = (key: string, index: number, count: number): number => {
  const rows = Math.ceil(count / COLUMNS);
  const col = index % COLUMNS;
  switch (key) {
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowLeft':
      return (index - 1 + count) % count;
    case 'ArrowDown': {
      const target = index + COLUMNS;
      return target >= count ? col : target;
    }
    case 'ArrowUp': {
      let target = index - COLUMNS;
      if (target < 0) {
        target = (rows - 1) * COLUMNS + col;
        if (target >= count) target -= COLUMNS;
      }
      return target;
    }
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return index;
  }
};

const EmojiPicker = ({ onSelect, disabled = false, className, tabIndex }: EmojiPickerProps) => {
  const { t } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const buttons = () => Array.from(gridRef.current?.querySelectorAll<HTMLElement>('button') ?? []);

  return (
    <Dropdown
      role="dialog"
      aria-label={t('v2.ui.editor.emoji')}
      content={({ close, focusTrigger }) => (
        <div
          ref={gridRef}
          className="grid grid-cols-5 gap-1 p-2"
          onFocusCapture={(e) => {
            const idx = buttons().indexOf(e.target);
            if (idx !== -1) setActiveIndex(idx);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              // Leave the picker: return to the trigger so focus flows on naturally, then close.
              focusTrigger();
              close();
              return;
            }
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
            // Consume the key so the toolbar's roving-focus handler doesn't also act on it.
            e.preventDefault();
            e.stopPropagation();
            const next = nextIndex(e.key, activeIndex, EMOJIS.length);
            buttons()[next]?.focus();
          }}
        >
          {EMOJIS.map(({ emoji, labelKey }, i) => (
            <IconButton
              key={emoji}
              type="button"
              onClick={() => onSelect(emoji)}
              aria-label={t(`v2.ui.editor.emojis.${labelKey}`)}
              tabIndex={i === activeIndex ? 0 : -1}
              className="min-h-8 min-w-8 p-1.5 sm:min-h-11 sm:min-w-11 sm:p-2"
            >
              {emoji}
            </IconButton>
          ))}
        </div>
      )}
    >
      <IconButton
        type="button"
        disabled={disabled}
        aria-label={t('v2.ui.editor.emoji')}
        tabIndex={tabIndex}
        className={className}
      >
        😀
      </IconButton>
    </Dropdown>
  );
};

export default EmojiPicker;
