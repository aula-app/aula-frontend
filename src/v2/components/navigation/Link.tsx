import { AnchorHTMLAttributes, ReactNode, forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type BaseRouterLinkProps = { to: string; className?: string } & Omit<RouterLinkProps, 'to' | 'children'>;
type BaseAnchorProps = { href: string; to?: never; className?: string } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
>;

// Require aria-label when no children are provided (e.g. icon-only links)
type LinkProps = (BaseRouterLinkProps | BaseAnchorProps) &
  ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

const linkClass =
  'text-text-primary rounded-lg underline-offset-2 hover:underline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-text-primary';

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ className, ...props }, ref) => {
  const classes = twMerge(linkClass, className);

  if ('href' in props && props.href) {
    const { href, ...rest } = props;
    return <a ref={ref} href={href} className={classes} {...rest} />;
  }

  const { to, ...rest } = props as { to: string } & Omit<RouterLinkProps, 'to'>;
  return <RouterLink ref={ref} to={to} className={classes} {...rest} />;
});

Link.displayName = 'Link';

export default Link;
