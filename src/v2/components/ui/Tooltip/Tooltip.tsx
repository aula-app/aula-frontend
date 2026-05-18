import { ReactNode, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: Placement;
  showDelay?: number;
  hideDelay?: number;
  className?: string;
}

const GAP = 18;
const MARGIN = 24;
const EXIT_DURATION = 150; // ms — must match Tailwind duration-150

const computePosition = (trigger: DOMRect, tooltip: DOMRect, placement: Placement): { top: number; left: number } => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = trigger.top - tooltip.height - GAP;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
      if (top < MARGIN) top = trigger.bottom + GAP;
      break;
    case 'bottom':
      top = trigger.bottom + GAP;
      left = trigger.left + trigger.width / 2 - tooltip.width / 2;
      if (top + tooltip.height > vh - MARGIN) top = trigger.top - tooltip.height - GAP;
      break;
    case 'left':
      top = trigger.top + trigger.height / 2 - tooltip.height / 2;
      left = trigger.left - tooltip.width - GAP;
      if (left < MARGIN) left = trigger.right + GAP;
      break;
    case 'right':
      top = trigger.top + trigger.height / 2 - tooltip.height / 2;
      left = trigger.right + GAP;
      if (left + tooltip.width > vw - MARGIN) left = trigger.left - tooltip.width - GAP;
      break;
  }

  return {
    top: Math.max(MARGIN, Math.min(top, vh - tooltip.height - MARGIN)),
    left: Math.max(MARGIN, Math.min(left, vw - tooltip.width - MARGIN)),
  };
};

const Tooltip = ({ content, children, placement = 'top', className }: TooltipProps) => {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const [ready, setReady] = useState(false);

  // Measure and position after the portal renders — before paint
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;
    const position = computePosition(
      triggerRef.current.getBoundingClientRect(),
      tooltipRef.current.getBoundingClientRect(),
      placement
    );
    setPos(position);
    setReady(true);
  }, [visible, placement]);

  // Hide on scroll or resize to avoid stale position
  useEffect(() => {
    if (!visible) return;
    const hide = () => setVisible(false);
    window.addEventListener('scroll', hide, { capture: true, passive: true });
    window.addEventListener('resize', hide, { passive: true });
    return () => {
      window.removeEventListener('scroll', hide, { capture: true });
      window.removeEventListener('resize', hide);
    };
  }, [visible]);

  const show = () => {
    setReady(false);
    setPos({ top: -9999, left: -9999 });
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
    setReady(false);
  };

  return (
    <div
      className="inline-flex items-center justify-center relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span ref={triggerRef} aria-describedby={id}>
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 9999,
              opacity: ready ? 1 : 0,
              transition: ready ? 'opacity 150ms ease' : 'none',
            }}
            className={twMerge(
              'rounded-2xl px-2 py-1',
              'bg-theme-grey-light text-text-secondary text-xs shadow-xs',
              className
            )}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
