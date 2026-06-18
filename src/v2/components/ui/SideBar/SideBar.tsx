import Button from '@/v2/components/button/Button';
import Code from '@/v2/components/button/Code';
import DarkModeButton from '@/v2/components/button/DarkMode';
import LanguageButton from '@/v2/components/button/Language';
import Logout from '@/v2/components/button/Logout';
import PrintButton from '@/v2/components/button/Print';
import Icon from '@/v2/components/ui/Icon';
import { FC } from 'react';
import BugButton from '../../button/Bug';
import Profile from './Profile';
import { useSideBar } from './useSideBar';

const activeClass = 'bg-shadow font-semibold';

interface SideBarProps {
  menuOpen?: boolean;
  onClose?: () => void;
}

const SideBar: FC<SideBarProps> = ({ menuOpen = false, onClose }) => {
  const { t, items, isActive, isDrawerMode, handleKeyDown } = useSideBar({ onClose });

  return (
    <>
      <nav
        id="sidebar-menu"
        aria-label={t('v2.ui.navigation')}
        aria-modal={menuOpen && isDrawerMode ? true : undefined}
        className={`text-muted flex flex-col z-20 h-full w-56 shrink-0  border-muted border-r overflow-y-auto overflow-x-hidden print:hidden absolute left-0 bg-background transition-transform duration-150 ease-in-out transform-gpu pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
        inert={!menuOpen && isDrawerMode ? '' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <Code />
        <hr className="mb-1" />
        <Profile />
        <hr className="mt-1" />
        <ul data-nav-section="links" className="flex flex-col flex-1 list-none m-0 my-2">
          {items.map((item) => (
            <li key={item.path} className="mx-2 my-1">
              <Button
                text
                to={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`w-full justify-start ${isActive(item.path) ? activeClass : ''}`}
              >
                <Icon type={item.icon} aria-hidden="true" size="1.5rem" />
                <span className="flex-1 text-left">{t(`ui.navigation.${item.title}`)}</span>
                {item.chip && (
                  <span aria-hidden="true">
                    <item.chip />
                  </span>
                )}
              </Button>
            </li>
          ))}
          <li className="flex-1" aria-hidden="true" />
        </ul>
        <hr className="my-1" />
        <div data-nav-section="tools" className="flex shrink-0 items-center justify-around px-2 py-1">
          <DarkModeButton />
          <PrintButton />
          <BugButton />
          <LanguageButton />
        </div>
        <hr className="my-1" />
        <div data-nav-section="logout" className="px-2 py-1">
          <Logout />
        </div>
      </nav>
      <div
        className={`fixed z-10 top-0 left-0 w-full h-full bg-shade ${menuOpen ? 'opacity-50 dark:opacity-75' : 'opacity-0 pointer-events-none'} transition-opacity duration-150 ease-in-out md:hidden`}
        aria-hidden="true"
        onClick={onClose}
      />
    </>
  );
};

SideBar.displayName = 'SideBar';

export default SideBar;
