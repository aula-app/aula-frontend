import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right'; // Future enhancement for positioning
  wrapperClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className = '',
  wrapperClassName = '',
  label,
  position = 'right',
}) => {
  const [visible, setVisible] = React.useState(false);
  const tooltipId = React.useId();

  const positionClasses = {
    top: 'bottom-[calc(100%+0.25rem)] left-0 translate-y-3',
    bottom: 'top-[calc(100%+0.25rem)] left-0 -translate-y-3',
    left: 'right-[calc(100%+0.25rem)] top-0 -translate-x-3',
    right: 'left-[calc(100%+0.25rem)] top-0 translate-x-3',
  };

  return (
    <button
      type="button"
      className={twMerge(
        'relative rounded-3xl focus-visible:outline-1 focus-visible:outline-primary',
        wrapperClassName
      )}
      aria-label={label}
      aria-expanded={visible}
      aria-describedby={visible ? tooltipId : undefined}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onPointerEnter={() => setVisible(true)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setVisible(false)}
      onKeyDown={(e) => e.key === 'Escape' && setVisible(false)}
    >
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        className={twMerge(
          `absolute z-10 px-4 pt-1.5 pb-2 rounded-3xl rounded-tl-none w-max max-w-[min(75vw,18rem)] bg-background text-left transition-all duration-200 transform 
          ${positionClasses[position]}
          ${visible ? 'opacity-100 translate-0' : 'opacity-0 pointer-events-none'}`,
          className
        )}
      >
        {content}
      </div>
      {children}
    </button>
  );
};

export default Tooltip;
