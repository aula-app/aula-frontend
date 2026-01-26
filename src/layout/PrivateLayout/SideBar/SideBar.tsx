import { useMenuKeyboardNavigation } from '@/hooks/useMenuKeyboardNavigation';
import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../config';
import Icon from '@/components/new/Icon';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useIsAuthenticated } from '@/hooks';
import BugButton from '@/components/Buttons/BugButton';
import IconButton from '@/components/new/IconButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import UpdatesButton from '@/components/new/UpdatesButton';
import MessagesButton from '@/components/new/MessagesButton';

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBar
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBar component
 */
const emptyEvent: Record<string, never> = Object.freeze({});

const SideBar = (): JSX.Element => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const onLogout = useEventLogout();
  const navRef = useRef<HTMLUListElement>(null);
  const isAuthenticated = useIsAuthenticated();

  // Filter out items the user doesn't have permission to see and have a path
  const visibleItems = SIDEBAR_ITEMS.filter((item) => item.permission() && item.path);

  // Find the index of the current page in the menu items
  const currentPageIndex = visibleItems.findIndex(
    (item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  );

  const { handleKeyDown, setItemRef } = useMenuKeyboardNavigation({
    items: visibleItems,
    containerRef: navRef,
    onItemSelect: (item: any) => {
      if (item.path) {
        navigate(item.path);
      }
    },
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
    <>
      <span id="sidebar-nav-description" className="sr-only" aria-hidden="true">
        {t('ui.accessibility.navigationDescription')}
      </span>

      <ul
        className="flex-1 overflow-auto px-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label={t('ui.navigation.mainMenu')}
        role="menu"
        ref={navRef}
        tabIndex={-1}
        aria-describedby="sidebar-nav-description"
      >
        <li>
          <Link
            to="/settings/profile"
            role="menuitem"
            aria-label={t('ui.navigation.profile')}
            tabIndex={-1}
            onKeyDown={(e) => handleKeyDown(e as any, 0)}
            ref={setItemRef(0, currentPageIndex)}
            className="block mt-1 py-1 rounded-lg transition-colors hover:bg-theme-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {isAuthenticated && <UserInfo />}
          </Link>
        </li>

        <li className="my-1 px-3">
          <div className="border-t border-theme-grey" />
        </li>

        <li className="flex items-center justify-around px-2 my-2">
          <UpdatesButton className="sm:hidden" />
          <MessagesButton className="sm:hidden" />
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

        {visibleItems.map(({ icon, path, title }, index) => (
          <li key={`${title}-${path}`}>
            <Link
              to={path as string}
              className={`my-1 p-3 flex items-center gap-3 rounded-lg transition-colors w-full text-left ${
                location.pathname === path ? 'bg-theme-grey font-semibold' : 'hover:bg-theme-grey-light'
              } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}
              role="menuitem"
              aria-label={t(`ui.navigation.${title}`)}
              tabIndex={index === 0 ? 0 : -1}
              aria-current={location.pathname === path ? 'page' : undefined}
              data-testid={`navigation-${title}`}
              onKeyDown={(e) => handleKeyDown(e as any, index)}
              ref={setItemRef(index, currentPageIndex) as any}
            >
              {icon && <Icon type={icon} aria-hidden="true" size="1.5rem" />}
              <span className="text-sm">{t(`ui.navigation.${title}`)}</span>
            </Link>
          </li>
        ))}

        <li className="my-1 px-3">
          <div className="border-t border-theme-grey" />
        </li>

        <li>
          <button
            className="w-full p-3 flex items-center gap-3 rounded-lg transition-colors hover:bg-theme-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            role="menuitem"
            aria-label={t('auth.logout')}
            tabIndex={-1}
            onClick={onLogout}
          >
            <Icon type="logout" aria-hidden="true" size="1.5rem" />
            <span className="text-sm">{t('auth.logout')}</span>
          </button>
        </li>
      </ul>
    </>
  );
};

export default memo(SideBar);
