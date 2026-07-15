import { HTMLAttributes, TransitionEvent, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the content is expanded. When closed, content is inert and non-interactive. */
  open: boolean;
  innerClass?: string;
}

const Collapse = ({ open, className, innerClass, children, onTransitionEnd, ...props }: CollapseProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsAnimating(true);
  }, [open]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(event);

    if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows') {
      return;
    }

    setIsAnimating(false);
  };

  return (
    <div
      className={twMerge(
        'grid transition-all duration-150 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
        className
      )}
      inert={open ? undefined : ''}
      onTransitionEnd={handleTransitionEnd}
      {...props}
    >
      <div className={twMerge(open && !isAnimating ? 'overflow-visible' : 'overflow-hidden', 'min-h-0', innerClass)}>
        {children}
      </div>
    </div>
  );
};

export default Collapse;
