import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the content is expanded. When closed, content is inert and non-interactive. */
  open: boolean;
}

const Collapse = ({ open, className, children, ...props }: CollapseProps) => (
  <div
    className={twMerge(
      'grid transition-all duration-150 ease-in-out',
      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
      className
    )}
    inert={open ? undefined : ''}
    {...props}
  >
    <div className="overflow-hidden min-h-0">{children}</div>
  </div>
);

export default Collapse;
