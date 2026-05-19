import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  condensed?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Chip = ({ children, className, condensed = false, startIcon, endIcon, onMouseDown, ...props }: ChipProps) => {
  const { createRipple, RipplesContainer } = useRipple();

  return (
    <button
      className={[
        'relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap',
        condensed ? 'p-1 px-2' : 'p-1 px-3',
        'text-sm rounded-full font-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        className ?? 'bg-background text-text-secondary',
      ]
        .filter(Boolean)
        .join(' ')}
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
};

export default Chip;
