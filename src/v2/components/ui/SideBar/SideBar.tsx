import CodeCopy from '@/v2/components/button/CodeCopy';
import DarkModeButton from '@/v2/components/button/DarkMode';
import LanguageButton from '@/v2/components/button/Language';
import Logout from '@/v2/components/button/Logout';
import Link from '@/v2/components/navigation/Link';
import Icon from '@/v2/components/ui/Icon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useSidebarItems } from './useSidebarItems';

const navItemClass =
  'flex items-center gap-3 px-3 py-2 rounded-lg no-underline hover:no-underline transition-colors hover:bg-shadow text-text-primary';
const activeNavItemClass = 'bg-shadow font-semibold';

const SideBar: FC = () => {
  const { t } = useTranslation();
  const items = useSidebarItems();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <ul className="flex flex-col flex-1 h-full overflow-auto list-none m-0 px-1 py-2">
      {/* Profile */}
      <li>
        <Link
          to="/settings/profile"
          aria-current={isActive('/settings/profile') ? 'page' : undefined}
          className={`${navItemClass} ${isActive('/settings/profile') ? activeNavItemClass : ''}`}
        >
          <Icon type="user" aria-hidden="true" size="1.5rem" />
          <span className="font-light flex-1">{t('ui.navigation.profile')}</span>
        </Link>
      </li>

      <hr className="my-1 border-secondary" />

      {/* Nav items */}
      {items.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`${navItemClass} ${isActive(item.path) ? activeNavItemClass : ''}`}
          >
            <Icon type={item.icon} aria-hidden="true" size="1.5rem" />
            <span className="font-light flex-1">{t(`ui.navigation.${item.title}`)}</span>
            {item.chip && <item.chip />}
          </Link>
        </li>
      ))}

      <hr className="my-1 border-secondary" />

      {/* Utility actions */}
      <li className="flex items-center justify-around px-2 py-1">
        <DarkModeButton />
        <LanguageButton />
      </li>

      <hr className="my-1 border-secondary" />

      {/* Spacer */}
      <li className="flex-1" aria-hidden="true" />

      {/* Footer */}
      <li>
        <CodeCopy />
      </li>
      <li>
        <Logout />
      </li>
    </ul>
  );
};

SideBar.displayName = 'SideBar';

export default SideBar;
