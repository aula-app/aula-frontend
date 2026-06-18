import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRipple } from '@/hooks/useRipple';
import Tooltip from '@/v2/components/ui/Tooltip';

type BaseChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  condensed?: boolean;
  startIcon?: ReactNode;
  hint?: string;
  endIcon?: ReactNode;
};

// Require aria-label when no children are provided (e.g. icon-only chips)
type ChipProps = BaseChipProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const Chip = ({
  children,
  className,
  condensed = false,
  hint,
  startIcon,
  endIcon,
  onMouseDown,
  ...props
}: ChipProps) => {
  const { createRipple, RipplesContainer } = useRipple();

  const component = (
    <button
      className={twMerge(
        'relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap transition-[background-color] duration-200 ease-in-out cursor-pointer',
        condensed ? 'p-1 px-2' : 'p-1 px-3',
        'rounded-full hover:bg-shadow',
        className ?? 'bg-surface text-muted'
      )}
      onMouseDown={(e) => {
        createRipple(e);
        onMouseDown?.(e);
      }}
      {...props}
    >
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
      <RipplesContainer />
    </button>
  );

  return hint ? <Tooltip content={hint}>{component}</Tooltip> : component;
};

export default Chip;
