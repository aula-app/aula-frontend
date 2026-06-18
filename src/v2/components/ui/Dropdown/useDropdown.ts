import { useCallback, useEffect, useRef, useState } from 'react';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const focusTrigger = useCallback(() => {
    wrapperRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    // Dismiss any tooltip on the trigger when the dropdown opens.
    wrapperRef.current?.dispatchEvent(
      new PointerEvent('pointerleave', { bubbles: true, cancelable: true, pointerType: 'mouse' })
    );

    // Move focus to the selected item, falling back to first focusable item.
    const panel = wrapperRef.current?.querySelector<HTMLElement>('[role="listbox"]');
    const frame = requestAnimationFrame(() => {
      const target =
        panel?.querySelector<HTMLElement>('[aria-selected="true"]') ??
        panel?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      target?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); focusTrigger(); return; }

      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();

      const panel = wrapperRef.current?.querySelector<HTMLElement>('[role="listbox"]');
      const items = Array.from(
        panel?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])') ?? []
      );
      if (!items.length) return;

      const idx = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') items[(idx + 1) % items.length]?.focus();
      else if (e.key === 'ArrowUp') items[(idx - 1 + items.length) % items.length]?.focus();
      else if (e.key === 'Home') items[0]?.focus();
      else if (e.key === 'End') items[items.length - 1]?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  return { isOpen, toggle, close, focusTrigger, wrapperRef };
};
