import SkipNavigation from '@/components/SkipNavigation';
import AskConsent from '@/views/AskConsent';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import TopBar from './TopBar';
import { checkPermissions } from '@/utils';
import SideBar from './SideBar';

const LayoutContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden">
      <SkipNavigation mainContentId="main-content" />
      <TopBar mobileMenuOpen={mobileMenuOpen} onToggleMobileMenu={toggleMobileMenu} />
      <div className="flex min-h-0 flex-1">
        {!checkPermissions('system', 'hide') && (
          <nav
            className={
              'flex w-64 h-full max-h-[calc(100vh-3.5rem)] border-r absolute bg-paper border-gray-200 no-print overflow-y-auto transition-all z-[9998] ' +
              (mobileMenuOpen ? 'left-0' : '-left-64') +
              ' sm:relative'
            }
          >
            <SideBar />
          </nav>
        )}
        <div
          className={
            'fixed inset-0 bg-black/50 z-[9997] transition-opacity ' +
            (mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')
          }
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
        <AskConsent />
      </div>
    </div>
  );
};

export default LayoutContainer;
