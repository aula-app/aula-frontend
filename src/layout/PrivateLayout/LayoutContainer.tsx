import SkipNavigation from '@/components/SkipNavigation';
import { useOnMobile } from '@/hooks/layout';
import AskConsent from '@/views/AskConsent';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from '../config';
import TopBar from './TopBar';
import MainContent from './MainContent';

const LayoutContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();

  return (
    <Stack
      sx={{
        height: '100%',
        paddingTop: `calc(${onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT} + var(--safe-area-inset-top, 0px))`,
        paddingLeft: 'var(--safe-area-inset-left, 0px)',
        paddingRight: 'var(--safe-area-inset-right, 0px)',
        paddingBottom: 'var(--safe-area-inset-bottom, 0px)',
      }}
    >
      <SkipNavigation mainContentId="main-content" />
      <TopBar />
      <MainContent>{children}</MainContent>
      <AskConsent />
    </Stack>
  );
};

export default LayoutContainer;
