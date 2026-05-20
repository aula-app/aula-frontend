import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRipple } from '@/hooks/useRipple';
import { useMediaQuery } from '@mui/system';
import { Theme } from '@mui/material';

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  outlined?: boolean;
  color?: 'primary' | 'secondary' | 'error';
};

// Require aria-label when no children are provided (e.g. icon-only buttons)
type ButtonProps = BaseButtonProps &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, color = 'primary', onMouseDown, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();
    const dark = localStorage.getItem('darkMode')
      ? localStorage.getItem('darkMode') === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('Dark mode:', dark);

    return (
      <button
        ref={ref}
        aria-disabled={props.disabled}
        className={twMerge(
          'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
          'text-sm font-medium transition-all duration-200',
          `focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-current`,
          'disabled:cursor-not-allowed disabled:opacity-50',
          outlined
            ? `border border-${color} text-${color} hover:bg-${color}/10 active:bg-${color}/20`
            : `bg-${color} ${dark ? 'text-paper' : 'text-text-secondary'}  font-bold hover:brightness-90 active:brightness-75 focus-visible:outline-${color}`,
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
