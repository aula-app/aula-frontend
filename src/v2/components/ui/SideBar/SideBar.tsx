import Button from '@/v2/components/button/Button';
import CodeCopy from '@/v2/components/button/CodeCopy';
import DarkModeButton from '@/v2/components/button/DarkMode';
import LanguageButton from '@/v2/components/button/Language';
import Logout from '@/v2/components/button/Logout';
import PrintButton from '@/v2/components/button/Print';
import Icon from '@/v2/components/ui/Icon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSidebarItems } from './useSidebarItems';
import BugButton from '../../button/Bug';

const activeClass = 'bg-shadow font-semibold';

interface SideBarProps {
  menuOpen?: boolean;
  onClose?: () => void;
}

const SideBar: FC<SideBarProps> = ({ menuOpen = false, onClose }) => {
  const { t } = useTranslation();
  const items = useSidebarItems();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <nav
        id="sidebar-menu"
        aria-label={t('v2.ui.navigation')}
        className={`flex flex-col border-secondary border-r overflow-x-clip overflow-y-auto print:hidden absolute left-0 z-20 h-full bg-paper transition-transform duration-150 ease-in-out transform-gpu ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
        inert={menuOpen ? undefined : ''}
      >
        <CodeCopy />
        <hr className="my-1 border-secondary" />
        <Button
          text
          color="secondary"
          to="/settings/profile"
          aria-current={isActive('/settings/profile') ? 'page' : undefined}
          className={`w-full justify-start ${isActive('/settings/profile') ? activeClass : ''}`}
        >
          <Icon type="user" aria-hidden="true" size="1.5rem" />
          <span className="font-light flex-1 text-left">{t('ui.navigation.profile')}</span>
        </Button>
        <hr className="mt-1 border-secondary" />
        <ul className="flex flex-col h-full list-none m-0 my-2">
          {/* Nav items */}
          {items.map((item) => (
            <li key={item.path} className="mx-2 my-1">
              <Button
                text
                color="secondary"
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`w-full justify-start ${isActive(item.path) ? activeClass : ''}`}
              >
                <Icon type={item.icon} aria-hidden="true" size="1.5rem" />
                <span className="font-light flex-1 text-left">{t(`ui.navigation.${item.title}`)}</span>
                {item.chip && <item.chip />}
              </Button>
            </li>
          ))}

          {/* Spacer */}
          <li className="flex-1" aria-hidden="true" />
        </ul>
        {/* Footer */}
        <hr className="my-1 border-secondary" />
        {/* Utility actions */}
        <div className="flex items-center justify-around px-2 py-1">
          <DarkModeButton />
          <PrintButton />
          <BugButton />
          <LanguageButton icon />
        </div>
        <hr className="my-1 border-secondary" />
        <Logout />
      </nav>
      <div
        className={`fixed z-10 top-0 left-0 w-full h-full bg-shade ${menuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'} transition-opacity duration-150 ease-in-out md:hidden`}
        aria-hidden="true"
        onClick={onClose}
      />
    </>
  );
};

SideBar.displayName = 'SideBar';

export default SideBar;
