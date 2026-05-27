import SideBar from '@/v2/components/ui/SideBar';
import TopBar from '@/v2/components/ui/TopBar';
import useIsDrawerMode from '@/v2/hooks/useIsDrawerMode';
import { FunctionComponent, PropsWithChildren, useState } from 'react';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDrawerMode = useIsDrawerMode();

  const onToggleMenu = () => {
    setMenuOpen((prev) => {
      prev ? document.getElementById('main-content')?.focus() : document.getElementById('sidebar-menu')?.focus();
      return !prev;
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
      document.getElementById('main-content')?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-dvh w-full" onKeyDown={onKeyDown}>
      <TopBar onToggleMenu={onToggleMenu} menuOpen={menuOpen} />
      <div className="flex-1 flex flex-row-reverse relative">
        <main
          id="main-content"
          className="flex-1 flex"
          inert={menuOpen && !isDrawerMode ? '' : undefined}
          tabIndex={-1}
        >
          {children}
        </main>
        <SideBar menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </div>
  );
};

export default Layout;
