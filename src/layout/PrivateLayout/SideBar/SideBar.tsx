import BugButton from '@/components/Buttons/BugButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import RippleLink from '@/components/new/RippleLink/RippleLink';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useIsAuthenticated } from '@/hooks';
import { useMenuKeyboardNavigation } from '@/hooks/useMenuKeyboardNavigation';
import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../config';
import { ICON_TYPE } from '@/components/new/Icon/Icon';
import CodeButton from '@/components/Buttons/CodeButton';

interface SideBarProps {
  onClose?: () => void;
}

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBar
 * @param {function} [props.onClose] - Optional callback when drawer closes (for mobile)
 * @returns {JSX.Element} Rendered SideBar component
 */
const emptyEvent: Record<string, never> = Object.freeze({});

const SideBar = ({ onClose }: SideBarProps = {}): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const onLogout = useEventLogout();
  const navRef = useRef<HTMLUListElement>(null);
  const isAuthenticated = useIsAuthenticated();

  // Filter out items the user doesn't have permission to see and have a path
  const visibleItems = SIDEBAR_ITEMS.filter((item) => item.permission() && item.path);

  // Build complete menu items array including profile and logout
  const allMenuItems = [
    { type: 'profile', path: '/settings/profile', title: 'profile' },
    ...visibleItems.map((item) => ({ type: 'nav', ...item })),
    { type: 'logout', title: 'logout', action: onLogout },
  ];

  // Find the index of the current page in ALL menu items
  const currentPageIndex = allMenuItems.findIndex(
    (item) => item.path && (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
  );

  const { handleKeyDown, setItemRef } = useMenuKeyboardNavigation({
    items: allMenuItems,
    containerRef: navRef,
    onItemSelect: (item: any) => {
      if (item.type === 'logout') {
        item.action();
      } else if (item.path) {
        navigate(item.path);
      }
    },
    onClose,
    getItemLabel: (item: any) => t(`ui.navigation.${item.title}`),
  });

  // Focus the current page's nav item on first render
  useEffect(() => {
    if (currentPageIndex !== -1) {
      // Don't auto-focus if we're in fixed mode (desktop)
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
  }, [currentPageIndex]);

  return (
    <ul
      className="flex flex-col flex-1 overflow-auto px-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      aria-label={t('ui.navigation.mainMenu')}
      role="menu"
      ref={navRef}
      tabIndex={-1}
      aria-describedby="sidebar-nav-description"
    >
      <CodeButton />
      <li>
        <RippleLink
          to="/settings/profile"
          role="menuitem"
          aria-label={t('ui.navigation.profile')}
          tabIndex={0 === currentPageIndex ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e as any, 0)}
          ref={setItemRef(0, currentPageIndex)}
          className="block mt-1 py-1 rounded-lg transition-colors hover:bg-theme-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {isAuthenticated && <UserInfo />}
        </RippleLink>
      </li>

      <li className="my-1 px-3">
        <div className="border-t border-theme-grey" />
      </li>

      {visibleItems.map(({ icon, path, title, component }, index) => {
        // Add 1 to index because profile is at index 0
        const menuItemIndex = index + 1;
        return (
          <li key={`${title}-${path}`}>
            <RippleLink
              to={path as string}
              className={`my-1 p-3 flex items-center gap-3 rounded-lg transition-colors w-full text-left ${
                location.pathname === path ? 'bg-theme-grey font-semibold' : 'hover:bg-shadow'
              } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
              role="menuitem"
              tabIndex={menuItemIndex === currentPageIndex ? 0 : -1}
              aria-label={t(`ui.navigation.${title}`)}
              aria-current={location.pathname === path ? 'page' : undefined}
              data-testid={`navigation-${title}`}
              onKeyDown={(e) => handleKeyDown(e as any, menuItemIndex)}
              ref={setItemRef(menuItemIndex, currentPageIndex)}
            >
              {icon && <Icon type={icon} aria-hidden="true" size="1.5rem" />}
              <span className="font-light flex-1">{t(`ui.navigation.${title}`)}</span>
              {component &&
                (() => {
                  const Component = component;
                  return <Component />;
                })()}
            </RippleLink>
          </li>
        );
      })}

      <li className="mt-auto my-1 px-3">
        <div className="border-t border-theme-grey" />
      </li>

      <li className="flex items-center justify-around px-2">
        <ThemeToggleButton />
        <BugButton />
        <IconButton onClick={() => window.print()} aria-label={t('actions.print')} title={t('actions.print')}>
          <Icon type="print" aria-hidden="true" size="1.5rem" />
        </IconButton>
        <LocaleSwitch />
      </li>

      <li className="my-1 px-3">
        <div className="border-t border-theme-grey" />
      </li>

      <li className="pb-1">
        <RippleLink
          className="w-full p-3 flex items-center gap-3 rounded-lg transition-colors hover:bg-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          role="menuitem"
          aria-label={t('auth.logout')}
          tabIndex={allMenuItems.length - 1 === currentPageIndex ? 0 : -1}
          onClick={onLogout}
          onKeyDown={(e) => handleKeyDown(e as any, allMenuItems.length - 1)}
          ref={setItemRef(allMenuItems.length - 1, currentPageIndex)}
        >
          <Icon type="logout" aria-hidden="true" size="1.5rem" />
          <span className="font-light">{t('auth.logout')}</span>
        </RippleLink>
      </li>
    </ul>
  );
};

export default memo(SideBar);
