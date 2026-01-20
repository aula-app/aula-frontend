import { Link, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface RippleLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode;
  className?: string;
}

/**
 * A react-router-dom Link styled with a ripple effect
 * @component RippleLink
 */
const RippleLink: React.FC<RippleLinkProps> = ({ children, className = '', ...props }) => {
  const { createRipple, RipplesContainer } = useRipple();

  return (
    <Link onMouseDown={createRipple} className={`relative overflow-hidden transition-colors ${className}`} {...props}>
      {children}
      <RipplesContainer />
    </Link>
  );
};

export default RippleLink;
