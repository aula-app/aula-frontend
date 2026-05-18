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

const Tooltip = ({
  content,
  children,
  placement = 'top',
  showDelay = 300,
  hideDelay = 0,
  className,
}: TooltipProps) => {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const isTouchRef = useRef(false);
  const hideDelayRef = useRef(hideDelay);

  useEffect(() => {
    hideDelayRef.current = hideDelay;
  });

  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const [ready, setReady] = useState(false);

  // Measure and position after the portal renders — before paint
  useLayoutEffect(() => {
    if (!mounted || !triggerRef.current || !tooltipRef.current) return;
    const position = computePosition(
      triggerRef.current.getBoundingClientRect(),
      tooltipRef.current.getBoundingClientRect(),
      placement
    );
    setPos(position);
    setReady(true);
  }, [mounted, placement]);

  const doShow = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setReady(false);
    setPos({ top: -9999, left: -9999 });
    setMounted(true);
    rafRef.current = requestAnimationFrame(() => setShown(true));
  };

  const doHide = () => {
    if (!mounted && !shown) return; // nothing to hide
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    setShown(false);
    hideTimerRef.current = setTimeout(() => {
      setMounted(false);
      setReady(false);
      isTouchRef.current = false;
      hideTimerRef.current = null;
    }, EXIT_DURATION + hideDelayRef.current);
  };

  // Hide on scroll or resize to avoid stale position
  useEffect(() => {
    if (!mounted) return;
    const hide = () => {
      if (isTouchRef.current) return; // touch tooltips dismissed by outside tap, not scroll
      doHide();
    };
    window.addEventListener('scroll', hide, { capture: true, passive: true });
    window.addEventListener('resize', hide, { passive: true });
    return () => {
      window.removeEventListener('scroll', hide, { capture: true });
      window.removeEventListener('resize', hide);
    };
  }, [mounted]);

  const handleMouseEnter = () => {
    isTouchRef.current = false;
    showTimerRef.current = setTimeout(doShow, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    doHide();
  };

  const handleFocus = () => {
    isTouchRef.current = false;
    doShow(); // no delay on keyboard focus
  };

  const handleBlur = () => {
    doHide();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center justify-center relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span ref={triggerRef} aria-describedby={id}>
        {children}
      </span>

      {mounted &&
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
