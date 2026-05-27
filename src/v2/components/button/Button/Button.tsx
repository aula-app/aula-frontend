import { useRipple } from '@/hooks/useRipple';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  color?: 'primary' | 'secondary' | 'error';
};

type ButtonVariantProps = { outlined?: false; text?: boolean } | { outlined: true; text?: never };

// Require aria-label when no children are provided (e.g. icon-only buttons)
type ButtonProps = BaseButtonProps &
  ButtonVariantProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, text = false, color = 'primary', onMouseDown, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();
    const dark = localStorage.getItem('darkMode')
      ? localStorage.getItem('darkMode') === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
      <button
        ref={ref}
        className={twMerge(
          'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
          'text-sm font-medium transition-all duration-200 min-h-11 min-w-11',
          'disabled:cursor-not-allowed disabled:opacity-50',
          dark ? 'text-paper' : 'text-text-secondary',
          outlined
            ? `border border-${color} text-${color} hover:bg-${color}/10 active:bg-${color}/20`
            : text
              ? `text-${color} hover:bg-${color}/10 active:bg-${color}/20 shadow-none`
              : `bg-${color} font-bold hover:brightness-90 active:brightness-75`,
          `focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-${color}`,
          className
        )}
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
