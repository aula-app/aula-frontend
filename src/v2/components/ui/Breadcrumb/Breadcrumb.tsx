import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { getRuntimeConfig } from '@/config';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useBreadcrumb } from './useBreadcrumb';

/**
 * Breadcrumb component that displays navigation path as a dropdown
 * @component Breadcrumb
 */
const Breadcrumb: React.FC = () => {
  const { t } = useTranslation();
  const {
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
  } = useBreadcrumb();

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
    >
      <IconButton
        data-testid={TEST_IDS.BREADCRUMB_TOGGLE}
        ref={toggleButtonRef}
        onClick={handleToggle}
        className="relative overflow-hidden flex items-center gap-1 font-medium hover:opacity-80 transition-opacity rounded px-2 py-1"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="breadcrumb-menu"
        aria-label={t('v2.ui.a11y.breadcrumb.description', { var: currentPage })}
      >
        <Icon type="back" size="1.25rem" />
      </IconButton>

      <div
        data-testid={TEST_IDS.BREADCRUMB_MENU}
        ref={menuRef}
        id="breadcrumb-menu"
        className={`absolute flex flex-col-reverse top-full left-0 bg-paper font-light rounded-lg max-w-sm shadow-sm p-1 z-50 transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 mt-1' : 'opacity-0 -mt-2 pointer-events-none'
        }`}
        aria-label={t('v2.ui.a11y.breadcrumb.nav')}
        aria-hidden={!isOpen}
        role="menu"
        onKeyDown={handleMenuKeyDown}
      >
        {navItems.map((item, index) => {
          const iconType = getIconForBreadcrumb(item[0], item[1]);
          return (
            <Link
              key={index}
              to={item[1]}
              onClick={handleItemClick}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-shadow truncate transition-colors rounded-sm"
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
