import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRipple } from '@/hooks/useRipple';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outlined?: boolean;
  color?: 'primary' | 'secondary' | 'error';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, color = 'primary', onMouseDown, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();

    return (
      <button
        ref={ref}
        className={twMerge(
          'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
          'text-sm font-medium transition-all duration-200',
          `focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-current`,
          'disabled:cursor-not-allowed disabled:opacity-50',
          outlined
            ? `border border-${color} text-${color} hover:bg-${color}/10 active:bg-${color}/20`
            : `bg-${color} text-paper font-bold hover:brightness-90 active:brightness-75 focus-visible:outline-${color}`,
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
