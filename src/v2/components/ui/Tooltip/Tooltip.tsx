import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  label?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, className = '', label }) => {
  const [visible, setVisible] = React.useState(false);
  const tooltipId = React.useId();

  return (
    <button
      type="button"
      className="relative rounded-3xl focus-visible:outline-1 focus-visible:outline-primary"
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
          `absolute z-10 px-3 py-1 rounded-3xl rounded-tl-none left-[calc(100%+0.25rem)] w-screen max-w-[75vw] bg-theme-grey-light text-left transition-all duration-200 ${visible ? 'opacity-100' : 'opacity-0 transform translate-x-3 pointer-events-none'}`,
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
