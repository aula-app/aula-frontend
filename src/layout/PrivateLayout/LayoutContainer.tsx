import SkipNavigation from '@/components/SkipNavigation';
import AskConsent from '@/views/AskConsent';
import { FunctionComponent, PropsWithChildren } from 'react';
import TopBar from './TopBar';
import { checkPermissions } from '@/utils';
import SideBar from './SideBar';

const LayoutContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-full overflow-clip">
      <SkipNavigation mainContentId="main-content" />
      <TopBar />
      <div className="flex flex-1">
        {!checkPermissions('system', 'hide') && (
          <nav className="w-64 h-full border-r border-gray-200 overflow-auto no-print hidden sm:block">
            <SideBar />
          </nav>
        )}
        <main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
          {children}
        </main>
        <AskConsent />
      </div>
    </div>
  );
};

export default LayoutContainer;
