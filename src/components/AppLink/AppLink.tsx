import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { forwardRef, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_LINK_COLOR, APP_LINK_UNDERLINE } from '../config';

interface Props extends MuiLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  openInNewTab?: boolean;
  disabled?: boolean;
  /**
   * Accessibility label for the link.
   * If not provided, will use the link content (children) as the accessible name.
   */
  'aria-label'?: string;
  /**
   * Optional context to include in the aria-label (e.g., "User profile for John Doe")
   */
  ariaContext?: string;
}

/**
 * Restyled Link for navigation in the App, support internal links by "to" prop and external links by "href" prop
 * @component AppLink
 * @param {object|function} children - content to wrap with <a> tag
 * @param {string} [to] - internal link URI
 * @param {string} [href] - external link URI
 * @param {boolean} [openInNewTab] - link will be opened in new tab when true
 */
const AppLink = forwardRef<any, Props>(
  (
    {
      children,
      color = APP_LINK_COLOR,
      underline = APP_LINK_UNDERLINE,
      to = '',
      href,
      openInNewTab = Boolean(href), // Open external links in new Tab by default,
      disabled = false,
      'aria-label': ariaLabel,
      ariaContext,
      ...restOfProps
    },
    ref
  ) => {
    const { t } = useTranslation();
    
    // Determine the appropriate aria-label
    let accessibilityLabel = ariaLabel;
    
    // Create a descriptive label with context if provided
    if (ariaContext && !accessibilityLabel) {
      if (typeof children === 'string') {
        accessibilityLabel = t('accessibility.aria.linkWithContext', { 
          context: ariaContext, 
          content: children 
        });
      } else {
        accessibilityLabel = ariaContext;
      }
    }
    
    // If we're opening in new tab, indicate that to screen reader users
    if (openInNewTab && accessibilityLabel) {
      accessibilityLabel = t('accessibility.aria.opensInNewTab', { 
        label: accessibilityLabel 
      });
    }
    
    const propsToRender = {
      color,
      underline,
      ...(openInNewTab ? { target: '_blank', rel: 'noreferrer noopener' } : {}),
      'aria-label': accessibilityLabel,
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
  }
);

export default AppLink;
