import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTooltipPlacement } from './useTooltipPlacement';

type TooltipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> & {
  content: React.ReactNode;
  children: React.ReactElement;
  wrapperClassName?: string;
  tapToShow?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  wrapperClassName = '',
  className,
  id,
  tapToShow = false,
  ...restOfProps
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const longPressTimer = React.useRef<number | undefined>(undefined);
  const suppressNextClick = React.useRef(false);
  const isTouchActive = React.useRef(false);
  const generatedId = React.useId();
  const tooltipId = id ?? generatedId;
  const { placementClass, containerWidth } = useTooltipPlacement(wrapper);
  const [visible, setVisible] = React.useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const handleTouchStart = () => {
    isTouchActive.current = true;
    longPressTimer.current = window.setTimeout(() => {
      show();
      suppressNextClick.current = true;
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current !== undefined) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = undefined;
      if (tapToShow) show();
    }
    setTimeout(() => {
      isTouchActive.current = false;
    }, 50);
  };

  const handleTouchMove = () => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = undefined;
    setTimeout(() => {
      isTouchActive.current = false;
    }, 50);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (suppressNextClick.current) {
      e.stopPropagation();
      suppressNextClick.current = false;
    }
  };

  React.useEffect(() => {
    if (!visible) return;
    const handleOutsideTouch = (e: TouchEvent) => {
      if (wrapper.current && !wrapper.current.contains(e.target as Node)) {
        hide();
      }
    };
    document.addEventListener('touchstart', handleOutsideTouch);
    return () => document.removeEventListener('touchstart', handleOutsideTouch);
  }, [visible]);

  return (
    <div
      ref={wrapper}
      className={twMerge('relative flex items-center justify-center', wrapperClassName)}
      style={{ '--tooltip-container-w': `${containerWidth}px` } as React.CSSProperties}
      onFocus={show}
      onBlur={hide}
      onPointerEnter={(e) => !isTouchActive.current && e.pointerType !== 'touch' && show()}
      onPointerLeave={(e) => !isTouchActive.current && e.pointerType !== 'touch' && hide()}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchMove}
      onClickCapture={handleClickCapture}
    >
      <div
        id={tooltipId}
        role="tooltip"
        className={twMerge(
          `absolute z-10 px-4 pt-1.5 pb-2 rounded-3xl w-max max-w-[min(calc(var(--tooltip-container-w)*0.75),18rem)] bg-theme-grey-light text-left transition-all duration-200 transform
          ${placementClass}
          ${visible ? 'opacity-100 translate-0' : 'opacity-0 pointer-events-none invisible'} `,
          className
        )}
        {...restOfProps}
      >
        {content}
      </div>
      {React.isValidElement(children)
        ? React.cloneElement(children, { 'aria-describedby': tooltipId } as any)
        : children}
    </div>
  );
};

export default Tooltip;
