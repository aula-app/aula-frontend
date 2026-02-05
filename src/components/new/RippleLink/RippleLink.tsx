import { Link, LinkProps } from 'react-router-dom';
import { ReactNode, forwardRef } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface RippleLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  className?: string;
}

/**
 * A react-router-dom Link styled with a ripple effect
 * @component RippleLink
 */
const RippleLink = forwardRef<HTMLAnchorElement, RippleLinkProps>(({ children, className = '', ...props }, ref) => {
  const { createRipple, RipplesContainer } = useRipple();

  return (
    <Link
      ref={ref}
      onMouseDown={createRipple}
      className={`relative overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {children}
      <RipplesContainer />
    </Link>
  );
});

RippleLink.displayName = 'RippleLink';

export default RippleLink;
