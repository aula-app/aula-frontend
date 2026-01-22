import Icon from '@/components/new/Icon';
import RippleLink from '@/components/new/RippleLink';
import { useAppStore } from '@/store/AppStore';
import { useRipple } from '@/hooks/useRipple';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { createRipple: createButtonRipple, RipplesContainer: ButtonRipplesContainer } = useRipple();

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

  // No breadcrumbs - show just "aula"
  if (breadcrumb.length === 0) {
    return (
      <h1 aria-label={t('ui.accessibility.schoolName')} className="flex items-center justify-center h-full">
        aula
      </h1>
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
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={createButtonRipple}
        className="relative overflow-hidden flex items-center gap-1 font-medium hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="menu"
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
        <ButtonRipplesContainer />
      </button>

      <div
        className={`absolute flex flex-col-reverse top-full left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-sm p-1 w-full z-50 transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 mt-1' : 'opacity-0 -mt-2 pointer-events-none'
        }`}
        aria-label={t('ui.accessibility.navigationMenu')}
        role="menu"
      >
        {navItems.map((item, index) => (
          <RippleLink
            key={index}
            to={item[1]}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-theme-grey  truncate transition-colors rounded-sm"
            role="menuitem"
          >
            <span className="truncate">{item[0]}</span>
          </RippleLink>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
