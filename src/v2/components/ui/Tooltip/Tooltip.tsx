import React from 'react';
import { twMerge } from 'tailwind-merge';
import { usePlacement, XZone, YZone } from '@/v2/utils/placement';

type TooltipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> & {
  content: React.ReactNode;
  children: React.ReactElement;
  wrapperClassName?: string;
  tapToShow?: boolean;
};

// Slide-in offsets for the hidden state — tooltip-specific animation detail.
const slideY: Record<YZone, string> = {
  top: '-translate-y-3',
  middle: '',
  bottom: 'translate-y-3',
};
const slideX: Record<XZone, string> = {
  left: '-translate-x-3',
  center: '',
  right: 'translate-x-3',
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

  const { zones, verticalClass, horizontalClass, cornerClass, containerWidth } = usePlacement(wrapper);
  const vertical = zones.x === 'center' && zones.y === 'middle' ? 'top' : zones.y;
  const placementClass = twMerge(verticalClass, slideY[vertical], horizontalClass, slideX[zones.x], cornerClass);

  const [visible, setVisible] = React.useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  // Don't show tooltip when the trigger controls an open popup (e.g. dropdown).
  const isExpanded = () => !!wrapper.current?.querySelector('[aria-expanded="true"]');

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
      onFocus={() => !isExpanded() && show()}
      onBlur={hide}
      onPointerEnter={(e) => !isTouchActive.current && e.pointerType !== 'touch' && !isExpanded() && show()}
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
