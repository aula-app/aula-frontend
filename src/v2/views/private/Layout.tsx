import SideBar from '@/v2/components/ui/SideBar';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col relative h-dvh w-full">
      <header className="relative bg-primary px-2 py-1 shadow-sm pt-[calc(var(--safe-area-inset-top,0px))] z-30">
        header
      </header>
      <div className="flex-1 flex flex-row-reverse">
        <main className="flex-1 flex">{children}</main>
        <SideBar />
      </div>
    </div>
  );
};

export default Layout;
