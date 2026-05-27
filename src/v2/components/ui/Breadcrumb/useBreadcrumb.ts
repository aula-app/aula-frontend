import { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useAppStore } from '@/store/AppStore';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type BreadcrumbNavItem = [string, string];

export const useBreadcrumb = () => {
  const { t } = useTranslation();
  const [appState] = useAppStore();
  const { breadcrumb } = appState;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const goto = useNavigate();

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
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
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
        setIsOpen(false);
        break;
    }
  };

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

  const handleToggle = () => {
    if (navItems.length <= 1) {
      goto('/');
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = () => setIsOpen(false);

  return {
    isOpen,
    isEmpty,
    currentPage,
    navItems,
    dropdownRef,
    toggleButtonRef,
    menuRef,
    getIconForBreadcrumb,
    handleToggle,
    handleItemClick,
    handleMenuKeyDown,
  };
};
