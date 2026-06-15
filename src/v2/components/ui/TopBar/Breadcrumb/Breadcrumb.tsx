import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { getRuntimeConfig } from '@/config';
import { TEST_IDS } from '@/test-ids';
import { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useBreadcrumb } from './useBreadcrumb';

/**
 * Breadcrumb component that displays navigation path as a dropdown
 * @component Breadcrumb
 */
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const { isEmpty, currentPage, navItems, getIconForBreadcrumb } = useBreadcrumb();
  const goto = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  const handleFocusOut = (event: FocusEvent<HTMLElement>) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="p-2">
        <img
          src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
          alt={t('app.name.icon')}
          className="h-8 object-contain"
        />
      </div>
    );
  }

  return (
    <nav
      data-testid={TEST_IDS.BREADCRUMB_NAV}
      aria-label={t('v2.ui.a11y.breadcrumb.label')}
      className="relative flex items-center justify-center h-full"
      ref={dropdownRef}
      onBlur={handleFocusOut}
    >
      <IconButton
        data-testid={TEST_IDS.BREADCRUMB_TOGGLE}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="breadcrumb-menu"
        aria-label={t('v2.ui.a11y.breadcrumb.description', { var: currentPage })}
      >
        <Icon type="back" size="1.25rem" />
      </IconButton>

      <div
        data-testid={TEST_IDS.BREADCRUMB_MENU}
        id="breadcrumb-menu"
        className={`absolute flex flex-col-reverse top-full bg-paper text-text-primary font-light rounded-2xl rounded-tl-none max-w-sm shadow-sm border border-secondary p-1 z-50 transition-all duration-300 ease-out left-1/2 ${
          isOpen ? 'opacity-100 mt-0' : 'opacity-0 -mt-2 pointer-events-none'
        }`}
        aria-label={t('v2.ui.a11y.breadcrumb.nav')}
        aria-hidden={!isOpen}
        role="menu"
        onKeyDown={handleEscape}
      >
        {navItems.map((item, index) => {
          const iconType = getIconForBreadcrumb(item[0], item[1]);
          return (
            <Link
              key={index}
              to={item[1]}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-shadow truncate transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-secondary"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              {iconType && <Icon type={iconType} size="1.2rem" />}
              <span className="truncate">{item[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
