import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  outlined?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, outlined = false, onMouseDown, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();

    return (
      <button
        ref={ref}
        className={[
          'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 shadow-xs',
          'text-sm font-medium transition-all duration-200',
          'focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          outlined
            ? 'border border-primary text-primary hover:bg-primary/10 active:bg-primary/20'
            : 'bg-primary text-text-primary hover:brightness-90 active:brightness-75',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
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
