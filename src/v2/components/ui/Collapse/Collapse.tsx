import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the content is expanded. When closed, content is inert and non-interactive. */
  open: boolean;
  innerClass?: string;
}

const Collapse = ({ open, className, innerClass, children, ...props }: CollapseProps) => (
  <div
    className={twMerge(
      'grid transition-all duration-150 ease-in-out',
      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
      className
    )}
    inert={open ? undefined : ''}
    {...props}
  >
    <div className={twMerge('overflow-hidden min-h-0', innerClass)}>{children}</div>
  </div>
);

export default Collapse;
