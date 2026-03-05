import { Link, LinkProps } from 'react-router-dom';
import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface RippleLinkProps extends Omit<LinkProps, 'className' | 'to'> {
  children: ReactNode;
  className?: string;
  to?: string;
}

/**
 * A react-router-dom Link styled with a ripple effect.
 * Falls back to a button element when `to` prop is missing.
 * @component RippleLink
 */
const RippleLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, RippleLinkProps>(
  ({ children, className = '', to, ...props }, ref) => {
    const { createRipple, RipplesContainer } = useRipple();
    const baseClassName = `relative overflow-hidden transition-colors ${className}`;

    if (to) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          onMouseDown={createRipple}
          className={baseClassName}
          {...(props as Omit<LinkProps, 'className' | 'to'>)}
        >
          {children}
          <RipplesContainer />
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onMouseDown={createRipple}
        className={baseClassName}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
        <RipplesContainer />
      </button>
    );
  }
);

RippleLink.displayName = 'RippleLink';

export default RippleLink;
