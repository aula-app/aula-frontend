import { ErrorBoundary } from '@/components';
import { checkPermissions } from '@/utils';
import { FunctionComponent, PropsWithChildren } from 'react';
import SideBar from './SideBar';

const MainContent: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {!checkPermissions('system', 'hide') && (
        <nav className="w-52">
          <SideBar />
        </nav>
      )}
      <main id="main-content" className="flex flex-row grow" tabIndex={-1}>
        <div className="flex flex-col flex-1 min-h-0 overflow-x-hidden">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default MainContent;
