import SkipNavigation from '@/components/SkipNavigation';
import { useOnMobile } from '@/hooks/layout';
import AskConsent from '@/views/AskConsent';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';
import MainContent from './MainContent';
import TopBar from './TopBar';

const LayoutContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <SkipNavigation mainContentId="main-content" />
      <TopBar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <AskConsent />
    </div>
  );
};

export default LayoutContainer;
