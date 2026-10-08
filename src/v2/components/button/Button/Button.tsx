import { useRipple } from '@/hooks/useRipple';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'children'> & {
  color?: 'primary' | 'secondary' | 'error';
  to?: string;
};

type ButtonVariantProps = { outlined?: false; text?: boolean } | { outlined: true; text?: never };

// Require aria-label when no children are provided (e.g. icon-only buttons)
type ButtonProps = BaseButtonProps &
  ButtonVariantProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, text = false, color, onMouseDown, to, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();

    const classes = twMerge(
      'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
      'text-sm font-medium transition duration-200 min-h-11 min-w-11 cursor-pointer',
      outlined || text
        ? 'hover:bg-shadow active:bg-shadow'
        : 'hover:brightness-95 active:brightness-90 dark:hover:brightness-110 dark:active:brightness-125',
      `outline-${color ? `${color}-fg` : 'current'}`,
      'disabled:cursor-not-allowed disabled:opacity-50',
      outlined
        ? color
          ? `border border-${color}-fg text-${color}-fg`
          : 'border border-current text-current'
        : text
          ? color
            ? `text-${color}-fg shadow-none`
            : 'text-current shadow-none'
          : color
            ? `bg-${color} text-${color}-fg font-bold`
            : 'bg-primary text-primary-fg font-bold',
      className
    );

    if (to) {
      return (
        <Link to={to} className={classes} onMouseDown={createRipple} {...props}>
          {children}
          <RipplesContainer />
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        onMouseDown={(e) => {
          createRipple(e);
          onMouseDown?.(e);
        }}
        {...props}
      >
        {children}
        <RipplesContainer />
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
