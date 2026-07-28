import { HTMLAttributes, TransitionEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  innerClass?: string;
}

const Collapse = ({ open, className, innerClass, children, onTransitionEnd, ...props }: CollapseProps) => {
  const [prevOpen, setPrevOpen] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setIsAnimating(true);
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(event);

    if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') {
      return;
    }

    setIsAnimating(false);
  };

  const isClipped = !open || isAnimating;

  return (
    <div
      className={twMerge(
        'grid min-h-0 transition-all duration-150 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] pointer-events-none',
        isClipped ? 'overflow-hidden' : 'overflow-visible',
        className
      )}
      inert={open ? undefined : ''}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      <div className={twMerge('min-h-0', innerClass, isClipped ? 'overflow-hidden' : 'overflow-visible')}>
        {children}
      </div>
    </div>
  );
};

export default Collapse;
