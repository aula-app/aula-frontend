import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTooltipPlacement } from './useTooltipPlacement';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  label?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ children, content, className = '', wrapperClassName = '', label }) => {
  const wrapper = React.useRef<HTMLButtonElement>(null);
  const tooltipId = React.useId();
  const { placementClass } = useTooltipPlacement(wrapper);
  const [visible, setVisible] = React.useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <button
      ref={wrapper}
      type="button"
      className={twMerge(
        'relative rounded-3xl focus-visible:outline-1 flex items-center justify-center focus-visible:outline-primary',
        wrapperClassName
      )}
      aria-label={label}
      aria-expanded={visible}
      aria-describedby={visible ? tooltipId : undefined}
      onFocus={show}
      onBlur={hide}
      onPointerEnter={show}
      onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        className={twMerge(
          `absolute z-10 px-4 pt-1.5 pb-2 rounded-3xl w-max max-w-[min(75vw,18rem)] bg-background text-left transition-all duration-200 transform
          ${placementClass}
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
