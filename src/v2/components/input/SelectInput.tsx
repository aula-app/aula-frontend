import Icon from '@/components/new/Icon';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const SelectInput = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
}: SelectInputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const listboxId = `${inputId}-listbox`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = !error && helperText ? `${inputId}-helper` : undefined;

  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const hasValue = !!selectedOption;

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [open]);

  const openDropdown = () => {
    setOpen(true);
    setFocusedIndex(options.findIndex((o) => o.value === value));
  };

  const select = (optionValue: string) => {
    onChange?.(optionValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open && focusedIndex >= 0) {
          select(options[focusedIndex].value);
        } else {
          openDropdown();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) { openDropdown(); break; }
        setFocusedIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      <div className="relative">
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error || undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openDropdown())}
          onKeyDown={handleKeyDown}
          className={[
            'peer block w-full rounded-lg border border-input-border bg-transparent px-3 pt-4 pb-2 pr-10 shadow-inner',
            'text-sm text-left text-foreground transition-all duration-200',
            'focus:outline-1 focus:outline-offset-1',
            'hover:border-input-border-hover',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-error focus:outline-error focus:border-error'
              : 'focus:outline-primary focus:border-primary',
            open && !error ? 'border-primary outline-1 outline-offset-1 outline-primary' : '',
            open && error ? 'border-error outline-1 outline-offset-1 outline-error' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className={hasValue ? 'text-foreground' : 'invisible select-none'}>
            {selectedOption?.label ?? '\u00A0'}
          </span>
        </button>

        {label && (
          <label
            htmlFor={inputId}
            className={[
              'pointer-events-none absolute left-3 origin-left text-sm transition-all duration-200 bg-background px-0.5',
              hasValue || open
                ? 'top-0 -translate-y-1/2 scale-75'
                : 'top-1/2 -translate-y-1/2 scale-100',
              error
                ? 'text-error-fg'
                : open
                  ? 'text-primary'
                  : 'text-muted',
            ].join(' ')}
          >
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="ml-0.5">*</span>
                <span className="sr-only">(required)</span>
              </>
            )}
          </label>
        )}

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <Icon type="chevronDown" size="1.25em" className="text-muted" />
        </span>

        {open && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute z-50 mt-1 w-full rounded-lg border border-input-border bg-background shadow-md overflow-auto max-h-60 py-1"
          >
            {options.map((option, i) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onMouseDown={(e) => { e.preventDefault(); select(option.value); }}
                onMouseEnter={() => setFocusedIndex(i)}
                className={[
                  'px-3 py-2 text-sm cursor-pointer transition-colors duration-100',
                  option.value === value ? 'text-primary font-medium' : 'text-foreground',
                  focusedIndex === i ? 'bg-primary/10' : 'hover:bg-primary/5',
                ].join(' ')}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          error || helperText ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {error ? (
            <span id={errorId} role="alert" className="block pt-1 px-1 text-xs text-error-fg">
              <Icon type="alert" className="inline-block mr-1 mb-0.5" />
              {error}
            </span>
          ) : (
            <span id={helperId} className="block pt-1 px-1 text-xs text-secondary">
              {helperText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

SelectInput.displayName = 'SelectInput';

export default SelectInput;
