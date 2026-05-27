import SideBar from '@/v2/components/ui/SideBar';
import TopBar from '@/v2/components/ui/TopBar';
import { FunctionComponent, PropsWithChildren, useState } from 'react';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const onToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex-1 flex flex-col relative h-dvh w-full">
      <TopBar onToggleMenu={onToggleMenu} menuOpen={menuOpen} />
      <div className="flex-1 flex flex-row-reverse relative">
        <main className="flex-1 flex">{children}</main>
        <SideBar />
      </div>
    </div>
  );
};

export default Layout;
