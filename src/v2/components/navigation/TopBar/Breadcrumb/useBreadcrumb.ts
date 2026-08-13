import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useAppStore } from '@/store/AppStore';
import { FocusEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export type BreadcrumbNavItem = [string, string];

export const useBreadcrumb = () => {
  const { t } = useTranslation();
  const [appState] = useAppStore();
  const { breadcrumb } = appState;
  const goto = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isPhaseUrl = (url: string) => /\/phase\/\d+$/.test(url);
  const filteredBreadcrumbs = breadcrumb.filter((item, index) => index === 0 || !isPhaseUrl(item[1]));

  const getIconForBreadcrumb = (label: string, url: string): ICON_TYPE | null => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel === 'aula' || url === '/') return 'home';
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

  const isEmpty = filteredBreadcrumbs.length === 0;
  const currentPage = isEmpty ? '' : filteredBreadcrumbs[filteredBreadcrumbs.length - 1][0];
  const navItems: BreadcrumbNavItem[] = [
    [t('ui.navigation.home'), '/'],
    ...filteredBreadcrumbs.slice(0, -1),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (navItems.length <= 1) {
      goto('/');
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleMenuKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[currentIndex < items.length - 1 ? currentIndex + 1 : 0]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[currentIndex > 0 ? currentIndex - 1 : items.length - 1]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }, []);

  const handleFocusOut = (event: FocusEvent<HTMLElement>) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return {
    isEmpty,
    isHome,
    currentPage,
    navItems,
    getIconForBreadcrumb,
    isOpen,
    dropdownRef,
    itemRefs,
    handleToggle,
    handleMenuKeyDown,
    handleFocusOut,
    closeMenu,
  };
};
