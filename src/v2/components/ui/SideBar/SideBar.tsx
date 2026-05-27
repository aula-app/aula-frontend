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
}

const SideBar: FC<SideBarProps> = ({ menuOpen = false }) => {
  const { t } = useTranslation();
  const items = useSidebarItems();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav
      id="sidebar-menu"
      aria-label={t('v2.ui.navigation')}
      className="flex flex-col border-secondary border-r print:hidden"
    >
      <ul className="flex flex-col h-full list-none m-0 py-2">
        <li>
          <CodeCopy />
        </li>

        <li>
          <hr className="my-1 border-secondary" />
        </li>

        {/* Profile */}
        <li>
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
        </li>

        <li>
          <hr className="my-1 border-secondary" />
        </li>

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

        {/* Footer */}

        <li>
          <hr className="my-1 border-secondary" />
        </li>

        {/* Utility actions */}
        <li className="flex items-center justify-around px-2 py-1">
          <DarkModeButton />
          <PrintButton />
          <BugButton />
          <LanguageButton icon />
        </li>

        <li>
          <hr className="my-1 border-secondary" />
        </li>

        <li>
          <Logout />
        </li>
      </ul>
    </nav>
  );
};

SideBar.displayName = 'SideBar';

export default SideBar;
