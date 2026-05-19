import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTooltipPlacement } from './useTooltipPlacement';

type TooltipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> & {
  content: React.ReactNode;
  children: React.ReactNode;
  wrapperClassName?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  wrapperClassName = '',
  className,
  id,
  ...restOfProps
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const generatedId = React.useId();
  const tooltipId = id ?? generatedId;
  const { placementClass } = useTooltipPlacement(wrapper);
  const [visible, setVisible] = React.useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <div
      ref={wrapper}
      className={twMerge('relative flex items-center justify-center', wrapperClassName)}
      onFocus={show}
      onBlur={hide}
      onPointerEnter={show}
      onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
      aria-describedby={tooltipId}
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
        {...restOfProps}
      >
        {content}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
