import { AppIcon, AppLink } from '@/components';
import { announceToScreenReader } from '@/utils';
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Fragment, KeyboardEvent, memo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../config';

type Props = {
  isFixed?: boolean;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBarContent
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBarContent component
 */
const SideBarContent = ({ isFixed = false, onClose = () => {}, ...restOfProps }: Props): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const navRef = useRef<HTMLUListElement>(null);
  
  // Filter out items the user doesn't have permission to see
  const visibleItems = SIDEBAR_ITEMS.filter(item => item.permission());
  
  // Find the index of the current page in the menu items
  const currentPageIndex = visibleItems.findIndex(
    item => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );

  // Ref to store the item that should receive initial focus
  const initialFocusItemRef = useRef<HTMLLIElement | null>(null);
  
  // Handle keyboard navigation within the sidebar
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const itemCount = visibleItems.length;
    let nextIndex = index;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (index + 1) % itemCount;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (index - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // The link will handle navigation naturally
        if (onClose && !isFixed) {
          onClose({}, 'escapeKeyDown');
          announceToScreenReader(t('ui.accessibility.menuItemSelected', { 
            item: t(`ui.navigation.${visibleItems[index].title}`) 
          }), 'polite');
        }
        break;
      case 'Escape':
        if (onClose && !isFixed) {
          event.preventDefault();
          onClose({}, 'escapeKeyDown');
          announceToScreenReader(t('ui.accessibility.menuClosed'), 'polite');
        }
        break;
      default:
        break;
    }
    
    // If the index changed, focus the new item
    if (nextIndex !== index) {
      const items = navRef.current?.querySelectorAll('[role="menuitem"]');
      if (items && items[nextIndex]) {
        (items[nextIndex] as HTMLElement).focus();
      }
    }
  }, [visibleItems, onClose, isFixed, t]);
  
  // Focus the current page's nav item on first render
  useEffect(() => {
    if (initialFocusItemRef.current && currentPageIndex !== -1) {
      // Don't auto-focus if we're in fixed mode (desktop)
      if (!isFixed) {
        setTimeout(() => {
          // Focus the nav list itself first to announce it properly to screen readers
          if (navRef.current) {
            navRef.current.focus();
            setTimeout(() => {
              const items = navRef.current?.querySelectorAll('[role="menuitem"]');
              if (items && items[currentPageIndex]) {
                (items[currentPageIndex] as HTMLElement).focus();
              }
            }, 100);
          }
        }, 300); // Delay to allow drawer animation to complete
      }
    }
  }, [currentPageIndex, isFixed]);

  // Handler to update ref for the current item
  const setItemRef = (index: number) => (element: HTMLLIElement) => {
    if (index === currentPageIndex) {
      initialFocusItemRef.current = element;
    }
  };

  return (
    <>
      <Typography 
        variant="srOnly" 
        id="sidebar-nav-description"
      >
        {t('ui.accessibility.navigationDescription')}
      </Typography>
      
      <List
        component="ul"
        aria-label={t('ui.navigation.mainMenu')}
        role="menu"
        ref={navRef}
        tabIndex={-1} // Make the list container focusable for screen readers
        aria-describedby="sidebar-nav-description"
        {...restOfProps}
        sx={{ 
          flex: 1, 
          px: 1, 
          overflow: 'auto',
          '&:focus': {
            outline: '2px solid transparent', // Visible only for high contrast mode
          },
        }}
      >
        {visibleItems.map(({ icon, path, title }, index) => (
          <ListItemButton
            key={`${title}-${path}`}
            component={AppLink}
            to={path}
            href="" // Hard reset for .href property, otherwise links are always opened in new tab :(
            openInNewTab={false}
            role="menuitem"
            aria-label={t(`ui.navigation.${title}`)}
            tabIndex={index === 0 ? 0 : -1} // Only the first item is in the tab order
            aria-current={location.pathname === path ? 'page' : undefined}
            onClick={() => {
              if (onClose && !isFixed) {
                onClose({}, 'backdropClick');
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={setItemRef(index)}
            sx={{
              my: 0.5,
              borderRadius: 2,
              '&[aria-current="page"]': {
                bgcolor: 'action.selected',
                fontWeight: 'bold',
              },
              '&:focus-visible': {
                outline: theme => `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '-2px',
              },
            }}
          >
            <ListItemIcon aria-hidden="true">{icon && <AppIcon icon={icon} />}</ListItemIcon>
            <ListItemText 
              primary={t(`ui.navigation.${title}`)}
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default memo(SideBarContent);
