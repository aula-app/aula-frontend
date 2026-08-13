import { HTMLAttributes, TransitionEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  orientation?: 'vertical' | 'horizontal';
  innerClass?: string;
}

const Collapse = ({ open, className, innerClass, children, orientation = 'vertical', onTransitionEnd, ...props }: CollapseProps) => {
  const [prevOpen, setPrevOpen] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  const isHorizontal = orientation === 'horizontal';
  const animatedProperty = isHorizontal ? 'grid-template-columns' : 'grid-template-rows';

  if (open !== prevOpen) {
    setPrevOpen(open);
    setIsAnimating(true);
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(event);

    if (event.target !== event.currentTarget || event.propertyName !== animatedProperty) {
      return;
    }

    setIsAnimating(false);
  };

  const isClipped = !open || isAnimating;

  return (
    <div
      className={twMerge(
        'grid transition-all duration-150 ease-in-out',
        isHorizontal
          ? open
            ? 'grid-cols-[1fr]'
            : 'grid-cols-[0fr] pointer-events-none'
          : open
            ? 'grid-rows-[1fr]'
            : 'grid-rows-[0fr] pointer-events-none',
        isClipped ? 'overflow-hidden' : 'overflow-visible',
        className
      )}
      inert={open ? undefined : ''}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      <div
        className={twMerge(
          isHorizontal ? 'min-w-0' : 'min-h-0',
          innerClass,
          isClipped ? 'overflow-hidden' : 'overflow-visible'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
