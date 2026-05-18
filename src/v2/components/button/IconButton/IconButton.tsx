import { Link } from 'react-router-dom';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { useRipple } from '@/hooks/useRipple';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
  testId?: string;
  to?: string; // If provided, renders as a Link
  dense?: boolean;
}

/**
 * Flexible icon button that renders as a Link (if 'to' prop) or as a button
 * @component IconButton
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, title, className = '', disabled = false, testId, to, onClick, dense = false, ...restOfProps }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();

    const baseClassName = twMerge(
      'relative overflow-hidden aspect-square',
      'inline-flex items-center justify-center rounded-full',
      'text-current cursor-pointer select-none',
      'transition-[background-color] duration-200 ease-in-out',
      'hover:bg-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'focus-visible:ring-text-primary active:bg-black/[0.12] dark:active:bg-white/[0.12]',
      dense ? 'p-0' : 'p-2', // Apply no padding for dense variation
      className
    );

    const disabledClassName = twMerge(
      'inline-flex items-center justify-center rounded-full',
      'text-gray-400 cursor-not-allowed opacity-40',
      dense ? 'p-0' : 'p-2', // Apply no padding for dense variation
      className
    );

    const resolvedTestId =
      testId ??
      `icon-button-${String(to || 'button')
        .replace(/\//g, '-')
        .replace(/^-/, '')}`;

    if (disabled) {
      return (
        <span
          className={disabledClassName}
          title={title}
          aria-label={title}
          aria-disabled="true"
          data-testid={`${resolvedTestId}-disabled`}
        >
          {children}
        </span>
      );
    }

    // Render as Link if 'to' prop is provided
    if (to) {
      const { to: _to, ...linkProps } = restOfProps as any;
      return (
        <Link
          to={to}
          className={baseClassName}
          title={title}
          aria-label={title}
          data-testid={resolvedTestId}
          onMouseDown={createRipple}
          {...linkProps}
        >
          {children}
          <RipplesContainer />
        </Link>
      );
    }

    // Render as button otherwise
    return (
      <button
        ref={ref}
        className={baseClassName}
        title={title}
        aria-label={title}
        data-testid={resolvedTestId}
        onMouseDown={createRipple}
        onClick={onClick}
        {...(restOfProps as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
        <RipplesContainer />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
