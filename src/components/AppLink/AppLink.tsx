import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { APP_LINK_COLOR, APP_LINK_UNDERLINE } from '../config';

interface AppLinkProps extends MuiLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  openInNewTab?: boolean;
  disabled?: boolean;
}

/**
 * Restyled Link for navigation in the App, support internal links by "to" prop and external links by "href" prop
 * @component AppLink
 * @param {object|function} children - content to wrap with <a> tag
 * @param {string} [to] - internal link URI
 * @param {string} [href] - external link URI
 * @param {boolean} [openInNewTab] - link will be opened in new tab when true
 */
const AppLinkComponent: ForwardRefRenderFunction<HTMLAnchorElement, AppLinkProps> = (
  {
    children,
    color = APP_LINK_COLOR,
    underline = APP_LINK_UNDERLINE,
    to = '',
    href,
    openInNewTab = Boolean(href), // Open external links in new Tab by default,
    disabled = false,
    ...restOfProps
  },
  ref
) => {
  const propsToRender = {
    color,
    underline,
    ...(openInNewTab ? { target: '_blank', rel: 'noreferrer noopener' } : {}),
    ...restOfProps,
  };
  
  return disabled ? (
    <>{children}</>
  ) : href ? (
    <MuiLink ref={ref} href={href} {...propsToRender}>
      {children}
    </MuiLink>
  ) : (
    <MuiLink ref={ref} component={RouterLink} to={to as string} {...propsToRender}>
      {children}
    </MuiLink>
  );
};

const AppLink = forwardRef(AppLinkComponent);

export default AppLink;
