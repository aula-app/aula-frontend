import AskConsent from '@/views/AskConsent';
import SideBar from '@/v2/components/ui/SideBar';
import TopBar from '@/v2/components/ui/TopBar';
import { ModalRoot } from '@/v2/components/ui/Modal';
import useIsDrawerMode from '@/v2/hooks/useIsDrawerMode';
import { checkPermissions } from '@/utils';
import { FunctionComponent, PropsWithChildren, useEffect, useRef, useState } from 'react';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDrawerMode = useIsDrawerMode();
  const isRestricted = checkPermissions('system', 'hide');
  const prevMenuOpen = useRef(menuOpen);

  const onToggleMenu = () => setMenuOpen((prev) => !prev);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && menuOpen) setMenuOpen(false);
  };

  const onCloseMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen && !prevMenuOpen.current) {
      document.getElementById('sidebar-menu')?.focus();
    } else if (!menuOpen && prevMenuOpen.current) {
      document.getElementById('main-content')?.focus();
    }
    prevMenuOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <div className="flex-1 flex flex-col relative h-dvh w-full" onKeyDown={onKeyDown}>
      <TopBar onToggleMenu={onToggleMenu} menuOpen={menuOpen} showMenu={!isRestricted} />
      <div className="flex-1 min-h-0 flex flex-row-reverse relative">
        <main id="main-content" className="flex-1 flex overflow-hidden isolate pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]" inert={menuOpen && isDrawerMode ? '' : undefined} tabIndex={-1}>
          {children}
        </main>
        {!isRestricted && <SideBar menuOpen={menuOpen} onClose={onCloseMenu} />}
      </div>
      {!isRestricted && <AskConsent />}
      <ModalRoot />
    </div>
  );
};

export default Layout;
