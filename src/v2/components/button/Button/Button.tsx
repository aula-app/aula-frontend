import { useRipple } from '@/hooks/useRipple';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  color?: 'primary' | 'secondary' | 'error';
  to?: string;
};

type ButtonVariantProps = { outlined?: false; text?: boolean } | { outlined: true; text?: never };

// Require aria-label when no children are provided (e.g. icon-only buttons)
type ButtonProps = BaseButtonProps &
  ButtonVariantProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, text = false, color = 'primary', onMouseDown, to, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();
    const dark = localStorage.getItem('darkMode')
      ? localStorage.getItem('darkMode') === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    const classes = twMerge(
      'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
      'text-sm font-medium transition-all duration-200 min-h-11 min-w-11 cursor-pointer',
      'disabled:cursor-not-allowed disabled:opacity-50',
      dark ? 'text-paper' : 'text-current',
      outlined
        ? `border-text-${color} text-text-${color} hover:bg-${color} active:bg-${color}`
        : text
          ? `text-text-${color} hover:bg-${color} active:bg-${color} shadow-none`
          : `bg-${color} font-bold hover:brightness-90 active:brightness-75`,
      `focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-${color}`,
      className
    );

    if (to) {
      return (
        <Link to={to} className={classes} onMouseDown={createRipple}>
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
