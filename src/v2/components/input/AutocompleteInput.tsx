import TextInput from '@/v2/components/input/TextInput';
import { SelectOption } from '@/v2/components/input/SelectInput';
import Collapse from '@/v2/components/ui/Collapse';
import Icon from '@/v2/components/ui/Icon/Icon';
import { getClippingRect } from '@/v2/utils/placement';
import { KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

const MAX_LIST_HEIGHT = 240;
const GAP = 8;

interface AutocompleteInputProps {
  label: string;
  options: SelectOption[];
  /** Fires with the picked option's value. */
  onSelect: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

const AutocompleteInput = ({
  label,
  options,
  onSelect,
  loading = false,
  disabled = false,
  className,
  'data-testid': dataTestId,
}: AutocompleteInputProps) => {
  const { t } = useTranslation();
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [maxHeight, setMaxHeight] = useState(MAX_LIST_HEIGHT);

  const needle = query.trim().toLowerCase();
  const matches = needle ? options.filter((option) => option.label.toLowerCase().includes(needle)) : options;

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutsideClick, true);
    return () => document.removeEventListener('mousedown', onOutsideClick, true);
  }, [open]);

  useLayoutEffect(() => {
    const node = inputRef.current;
    if (!open || !node) return;
    const { top } = node.getBoundingClientRect();
    const clip = getClippingRect(node);
    setMaxHeight(Math.max(0, Math.min(MAX_LIST_HEIGHT, top - clip.top - GAP)));
  }, [open, matches.length]);

  useEffect(() => {
    setFocusedIndex((i) => (i >= matches.length ? matches.length - 1 : i));
  }, [matches.length]);

  useEffect(() => {
    if (options.length === 0 && !needle) setOpen(false);
  }, [options.length, needle]);

  const select = (value: string) => {
    onSelect(value);
    setQuery('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setFocusedIndex((i) => Math.min(i + 1, matches.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (open && focusedIndex >= 0 && matches[focusedIndex]) {
          e.preventDefault();
          select(matches[focusedIndex].value);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const isDisabled = disabled || loading || (options.length === 0 && !needle);

  return (
    <div ref={containerRef} className={twMerge('relative flex flex-col', className)}>
      <TextInput
        ref={inputRef}
        label={label}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
        disabled={isDisabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setFocusedIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        endAdornment={<Icon type="search" size="1.1em" className="mr-2 text-muted" />}
        data-testid={dataTestId}
      />

      <span aria-live="polite" className="sr-only">
        {open ? t('v2.form.autocomplete.results', { count: matches.length }) : ''}
      </span>

      <Collapse open={open} className="absolute bottom-[calc(100%+0.25rem)] z-50 w-full">
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          data-testid={dataTestId ? `${dataTestId}-list` : undefined}
          style={{ maxHeight }}
          className="overflow-auto rounded-lg border border-input-border bg-background py-1 shadow-md"
        >
          {matches.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted">{t('v2.form.autocomplete.noOptions')}</li>
          )}
          {matches.map((option, i) => (
            <li
              key={option.value}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={focusedIndex === i}
              data-testid={dataTestId ? `${dataTestId}-option-${option.value}` : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                select(option.value);
              }}
              onMouseEnter={() => setFocusedIndex(i)}
              className={twMerge(
                'cursor-pointer px-3 py-2 text-sm transition-colors duration-100',
                focusedIndex === i ? 'bg-primary/10 text-current' : 'text-muted hover:bg-primary/5'
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
};

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput;
