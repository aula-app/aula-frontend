import { ErrorBoundary } from '@/components';
import { useOnMobile } from '@/hooks/layout';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { SIDEBAR_DESKTOP_ANCHOR, TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import SideBar from './SideBar';
import TopBar from './TopBar';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [sideBarVisible, setSideBarVisible] = useState(false);

  const onMobile = useOnMobile();

  // Variant 1 - Sidebar is static on desktop and is a drawer on mobile
  const sidebarOpen = sideBarVisible;
  const sidebarVariant = 'temporary';

  // Variant 2 - Sidebar is drawer on mobile and desktop
  // const sidebarOpen = sideBarVisible;
  // const sidebarVariant = 'temporary';

  const title = TITLE_PRIVATE;
  document.title = title; // Also Update Tab Title

  const onSideBarOpen = () => {
    if (!sideBarVisible) setSideBarVisible(true); // Don't re-render Layout when SideBar is already open
  };

  const onSideBarClose = () => {
    if (sideBarVisible) setSideBarVisible(false); // Don't re-render Layout when SideBar is already closed
  };

  return (
    <Stack
      sx={{
        height: '100vh',
        paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <TopBar home={title} menuToggle={onSideBarOpen} />
      <SideBar anchor={SIDEBAR_DESKTOP_ANCHOR} open={sidebarOpen} variant={sidebarVariant} onClose={onSideBarClose} />

      <Stack component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PrivateLayout;
