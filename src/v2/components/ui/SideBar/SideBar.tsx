import Button from '@/v2/components/button/Button';
import CodeCopy from '@/v2/components/button/CodeCopy';
import DarkModeButton from '@/v2/components/button/DarkMode';
import LanguageButton from '@/v2/components/button/Language';
import Logout from '@/v2/components/button/Logout';
import PrintButton from '@/v2/components/button/Print';
import Icon from '@/v2/components/ui/Icon';
import useIsDrawerMode from '@/v2/hooks/useIsDrawerMode';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import BugButton from '../../button/Bug';
import { useSidebarItems } from './useSidebarItems';
import Profile from './Profile';

const activeClass = 'bg-shadow font-semibold';

interface SideBarProps {
  menuOpen?: boolean;
  onClose?: () => void;
}

const SideBar: FC<SideBarProps> = ({ menuOpen = false, onClose }) => {
  const { t } = useTranslation();
  const items = useSidebarItems();
  const { pathname } = useLocation();
  const isDrawerMode = useIsDrawerMode();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') { onClose?.(); document.getElementById('main-content')?.focus(); return; }
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;

    const nav = e.currentTarget;
    const active = document.activeElement as HTMLElement;

    const sec = (name: string) => nav.querySelector<HTMLElement>(`[data-nav-section="${name}"]`);
    const focusable = (section: HTMLElement | null): HTMLElement[] =>
      Array.from(section?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter(
        (el) => !el.closest('[aria-hidden="true"]')
      );

    const topSec = sec('top');
    const linksSec = sec('links');
    const toolsSec = sec('tools');
    const logoutSec = sec('logout');

    const inTop = topSec?.contains(active);
    const inLinks = linksSec?.contains(active);
    const inTools = toolsSec?.contains(active);
    const inLogout = logoutSec?.contains(active);

    if (inLinks) {
      const items = focusable(linksSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (idx < items.length - 1) items[idx + 1]?.focus(); else focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (idx > 0) items[idx - 1]?.focus(); else { const t = focusable(topSec); t[t.length - 1]?.focus(); } }
      else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const t = focusable(topSec); t[t.length - 1]?.focus(); }
    } else if (inTools) {
      const items = focusable(toolsSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowRight') { e.preventDefault(); items[(idx + 1) % items.length]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); items[(idx - 1 + items.length) % items.length]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); const l = focusable(linksSec); l[l.length - 1]?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); focusable(logoutSec)[0]?.focus(); }
    } else if (inTop) {
      const items = focusable(topSec);
      const idx = items.indexOf(active);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (idx < items.length - 1) items[idx + 1]?.focus();
        else focusable(linksSec)[0]?.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (idx > 0) items[idx - 1]?.focus();
        else focusable(logoutSec)[0]?.focus();
      }
    } else if (inLogout) {
      if (e.key === 'ArrowUp') { e.preventDefault(); focusable(toolsSec)[0]?.focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); const t = focusable(toolsSec); t[t.length - 1]?.focus(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); focusable(topSec)[0]?.focus(); }
    }
  };

  return (
    <>
      <nav
        id="sidebar-menu"
        aria-label={t('v2.ui.navigation')}
        aria-modal={menuOpen && isDrawerMode ? true : undefined}
        className={`flex flex-col z-20 h-full w-56 shrink-0 border-secondary border-r overflow-y-auto overflow-x-hidden print:hidden absolute left-0 bg-background transition-transform duration-150 ease-in-out transform-gpu pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
        inert={!menuOpen && isDrawerMode ? '' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div data-nav-section="top">
          <CodeCopy className="my-[0.1rem]" />
          <hr className="mb-1 border-secondary" />
          <Profile />
        </div>
        <hr className="mt-1 border-secondary" />
        <ul data-nav-section="links" className="flex flex-col flex-1 list-none m-0 my-2">
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
        <hr className="my-1 border-secondary" />
        <div data-nav-section="tools" className="flex shrink-0 items-center justify-around px-2 py-1">
          <DarkModeButton />
          <PrintButton />
          <BugButton />
          <LanguageButton />
        </div>
        <hr className="my-1 border-secondary" />
        <div data-nav-section="logout">
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
