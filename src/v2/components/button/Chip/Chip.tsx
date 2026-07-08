import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Tooltip from '@/v2/components/ui/Tooltip';
import Button from '../Button';

type ChipProps = Omit<ComponentProps<typeof Button>, 'outlined' | 'text'> & {
  condensed?: boolean;
  startIcon?: ReactNode;
  hint?: string;
  endIcon?: ReactNode;
};

const Chip = ({ children, className, condensed = false, hint, startIcon, endIcon, ...props }: ChipProps) => {
  const component = (
    <Button
      text
      className={twMerge(
        'min-h-0 min-w-0 gap-0 whitespace-nowrap rounded-full',
        condensed ? 'p-1 px-1.5' : 'p-1 px-3',
        className
      )}
      {...props}
    >
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </Button>
  );

  return hint ? <Tooltip content={hint}>{component}</Tooltip> : component;
};

export default Chip;
