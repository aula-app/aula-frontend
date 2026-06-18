import { Link } from 'react-router-dom';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { twMerge } from 'tailwind-merge';
import Tooltip from '@/v2/components/ui/Tooltip';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  children: ReactNode;
  'aria-label': string; // accessible name — always required
  hint?: string; // tooltip description only, not used as accessible name
  disabled?: boolean;
  to?: string;
  dense?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ dense = false, disabled = false, hint, to, children, className, ...restOfProps }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();

    const classes = twMerge(
      'relative overflow-hidden aspect-square inline-flex items-center justify-center rounded-full',
      'text-current cursor-pointer select-none transition-[background-color] duration-200 ease-in-out',
      'hover:bg-shadow active:bg-shadow',
      'disabled:cursor-not-allowed disabled:opacity-40 disabled:text-gray-400',
      dense ? 'p-0' : 'p-2',
      className
    );

    const component = to ? (
      <Link to={to} className={classes} onMouseDown={createRipple} {...(restOfProps as any)}>
        {children}
        <RipplesContainer />
      </Link>
    ) : (
      <button
        ref={ref}
        className={classes}
        aria-disabled={disabled}
        disabled={disabled}
        onMouseDown={createRipple}
        {...restOfProps}
      >
        {children}
        <RipplesContainer />
      </button>
    );

    return hint ? <Tooltip content={hint}>{component}</Tooltip> : component;
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
