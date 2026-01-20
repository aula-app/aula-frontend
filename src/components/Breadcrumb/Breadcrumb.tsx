import Icon from '@/components/Icon';
import { useAppStore } from '@/store/AppStore';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb component that displays navigation path as a dropdown
 * @component Breadcrumb
 */
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const [appState] = useAppStore();
  const { breadcrumb } = appState;
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuId = useId();

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

  // Close on escape key and return focus to button
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus first menu item when dropdown opens
  useEffect(() => {
    if (isOpen && menuItemsRef.current[0]) {
      menuItemsRef.current[0].focus();
      setFocusedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation for menu items
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const itemCount = menuItemsRef.current.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (index + 1) % itemCount;
        menuItemsRef.current[nextIndex]?.focus();
        setFocusedIndex(nextIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (index - 1 + itemCount) % itemCount;
        menuItemsRef.current[prevIndex]?.focus();
        setFocusedIndex(prevIndex);
        break;
      case 'Home':
        event.preventDefault();
        menuItemsRef.current[0]?.focus();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        menuItemsRef.current[itemCount - 1]?.focus();
        setFocusedIndex(itemCount - 1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // No breadcrumbs - show just "aula"
  if (breadcrumb.length === 0) {
    return (
      <nav aria-label={t('ui.accessibility.breadcrumb')} className="flex items-center justify-center h-full">
        <Link to="/" className="text-2xl font-medium hover:opacity-80 transition-opacity">
          aula
        </Link>
      </nav>
    );
  }

  // Check if a breadcrumb is a phase-only item (not the room entry point)
  // Room entry is the first breadcrumb with a phase URL - we keep it
  // Other phase URLs are hidden
  const isPhaseUrl = (url: string) => /\/phase\/\d+$/.test(url);

  // The first breadcrumb is always the room (keep it even if it has a phase URL)
  // Filter out other phase-only breadcrumbs
  const filteredBreadcrumbs = breadcrumb.filter((item, index) => index === 0 || !isPhaseUrl(item[1]));

  // Current page is the last filtered breadcrumb
  const currentPage = filteredBreadcrumbs[filteredBreadcrumbs.length - 1][0];

  // Navigation items: aula + all filtered breadcrumbs except the current one
  const navItems: [string, string][] = [['aula', '/'], ...filteredBreadcrumbs.slice(0, -1)];

  return (
    <nav
      aria-label={t('ui.accessibility.breadcrumb')}
      className="relative flex items-center justify-center h-full"
      ref={dropdownRef}
    >
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-lg font-medium hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={t('ui.accessibility.breadcrumbMenu', { page: currentPage })}
      >
        <span className="truncate max-w-64" aria-hidden="true">
          {currentPage}
        </span>
        <Icon
          type="arrowdown"
          size="1rem"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-sm py-1 min-w-48 max-w-72 z-50"
          role="menu"
          aria-label={t('ui.accessibility.navigationMenu')}
        >
          {navItems.map((item, index) => (
            <Link
              key={index}
              ref={(el) => (menuItemsRef.current[index] = el)}
              to={item[1]}
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 truncate transition-colors focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
              role="menuitem"
              tabIndex={focusedIndex === index ? 0 : -1}
            >
              {index === 0 ? (
                <span className="flex items-center gap-2">
                  <Icon type="home" size="1rem" aria-hidden="true" />
                  {item[0]}
                </span>
              ) : (
                <span className="pl-6">{item[0]}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumb;
