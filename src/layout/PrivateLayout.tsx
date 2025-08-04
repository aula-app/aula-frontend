import { ErrorBoundary } from '@/components';
import SkipNavigation from '@/components/SkipNavigation';
import { useIsOnline } from '@/hooks';
import { useOnMobile } from '@/hooks/layout';
import { checkPermissions } from '@/utils';
import AskConsent from '@/views/AskConsent';
import OfflineView from '@/views/OfflineView';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import SideBarFixed from './SideBar/SideBarFixed';
import TopBar from './TopBar';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [online, setOnline] = useState(true);

  const onMobile = useOnMobile();

  const title = TITLE_PRIVATE;
  document.title = title; // Also Update Tab Title

  const checkOnlineStatus = async () => {
    setOnline(await useIsOnline());
  };

  useEffect(() => {
    checkOnlineStatus();
  }, [location]);

  return !online ? (
    <OfflineView />
  ) : (
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

      <Stack
        direction="row"
        component="main"
        id="main-content"
        sx={{ flexGrow: 1, overflow: 'hidden' }}
        tabIndex={-1} // Makes the element focusable via skip nav but doesn't add it to normal tab order
      >
        {!checkPermissions('system', 'hide') && <SideBarFixed />}
        <Stack flex={1} overflow="hidden">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </Stack>
      </Stack>
      <AskConsent />
    </Stack>
  );
};

export default PrivateLayout;
