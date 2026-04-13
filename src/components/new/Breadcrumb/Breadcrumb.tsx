import Icon from '@/components/new/Icon';
import RippleLink from '@/components/new/RippleLink';
import { useAppStore } from '@/store/AppStore';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import IconButton from '../IconButton';
import { getRuntimeConfig } from '@/config';
import { ICON_TYPE } from '../Icon/Icon';

/**
 * Breadcrumb component that displays navigation path as a dropdown
 * @component Breadcrumb
 */
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const [appState] = useAppStore();
  const { breadcrumb } = appState;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const goto = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // When menu opens, focus the first menu item
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstItem = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]');
      firstItem?.focus();
    }
  }, [isOpen]);

  const closeAndReturnFocus = () => {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    );
    const focused = document.activeElement as HTMLElement;
    const index = items.indexOf(focused);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        closeAndReturnFocus();
        break;
      case 'Tab':
        // Close menu and let Tab continue naturally
        setIsOpen(false);
        break;
    }
  };

  const isPhaseUrl = (url: string) => /\/phase\/\d+$/.test(url);
  const filteredBreadcrumbs = breadcrumb.filter((item, index) => index === 0 || !isPhaseUrl(item[1]));

  /**
   * Maps a breadcrumb label and URL to an appropriate icon type
   */
  const getIconForBreadcrumb = (label: string, url: string): string | null => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel === 'aula' || url === '/') return 'home';
    // Check for specific combinations first (more specific before less specific)
    if (lowerLabel.includes('idea-box') || url.includes('/idea-box')) return 'box';
    if (lowerLabel.includes('idea') || url.includes('/idea')) return 'idea';
    if (lowerLabel.includes('announcement') || url.includes('/announcement')) return 'announcement';
    if (lowerLabel.includes('message') || url.includes('/message')) return 'message';
    if (lowerLabel.includes('report') || url.includes('/report')) return 'report';
    if (lowerLabel.includes('request') || url.includes('/request')) return 'request';
    if (lowerLabel.includes('room') || url.includes('/room')) return 'room';
    if (lowerLabel.includes('box') || url.includes('/box')) return 'box';

    return null;
  };

  // Early return if no breadcrumbs
  if (filteredBreadcrumbs.length === 0) {
    return (
      <div className="p-2 h-full">
        <img
          src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
          alt={t('app.name.icon')}
          className="h-full object-contain"
        />
      </div>
    );
  }

  const currentPage = filteredBreadcrumbs[filteredBreadcrumbs.length - 1][0];

  // Navigation items: aula + all filtered breadcrumbs except the current one
  const navItems: [string, string][] = [[t('ui.navigation.home'), '/'], ...filteredBreadcrumbs.slice(0, -1)];

  const backNavigation = () => {
    if (navItems.length <= 1) {
      goto('/');
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <nav
      aria-label={t('ui.accessibility.breadcrumb')}
      className="relative flex items-center justify-center h-full"
      ref={dropdownRef}
    >
      <IconButton
        ref={toggleButtonRef}
        onClick={backNavigation}
        className="relative overflow-hidden flex items-center gap-1 font-medium hover:opacity-80 transition-opacity rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('ui.accessibility.breadcrumbMenu', { page: currentPage })}
      >
        <Icon type="back" size="1.25rem" />
      </IconButton>

      <div
        ref={menuRef}
        className={`absolute flex flex-col-reverse top-full left-0 bg-paper font-light rounded-lg max-w-sm shadow-sm p-1 z-50 transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 mt-1' : 'opacity-0 -mt-2 pointer-events-none'
        }`}
        aria-label={t('ui.accessibility.navigationMenu')}
        role="menu"
        onKeyDown={handleMenuKeyDown}
      >
        {navItems.map((item, index) => {
          const iconType = getIconForBreadcrumb(item[0], item[1]) as ICON_TYPE | null;
          return (
            <RippleLink
              key={index}
              to={item[1]}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-shadow truncate transition-colors rounded-sm"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              {iconType && <Icon type={iconType} size="1.2rem" />}
              <span className="truncate">{item[0]}</span>
            </RippleLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
