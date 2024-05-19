import { useState, FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { AppIcon, AppIconButton, ErrorBoundary } from '@/components';
import { LinkToPage } from '@/types/PageLinks';
import { useOnMobile } from '@/hooks/layout';
import { SIDEBAR_DESKTOP_ANCHOR, TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import TopBar from './TopBar';
import SideBar from './SideBar';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */
const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const navigation = useNavigate();
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

  const location = useLocation().pathname.split('/');

  const onSideBarOpen = () => {
    console.log('OPEN', sideBarVisible);
    if (!sideBarVisible) setSideBarVisible(true); // Don't re-render Layout when SideBar is already open
  };

  const onSideBarClose = () => {
    if (sideBarVisible) setSideBarVisible(false); // Don't re-render Layout when SideBar is already closed
  };

  // console.log(
  //   'Render using PrivateLayout, onMobile:',
  //   onMobile,
  //   'sidebarOpen:',
  //   sidebarOpen,
  //   'sidebarVariant:',
  //   sidebarVariant
  // );

  return (
    <Stack
      sx={{
        height: '100vh',
        paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <Stack component="header">
        <TopBar
          startNode={location.length <= 2
            ? <Box sx={{width: '40px', height: '40px', padding: "2px"}}><AppIcon icon="logo" size='lg' /></Box> 
              : <AppIconButton icon="back" onClick={() => navigation(-1)} />}
          home={title}
          path={location}
          endNode={<AppIconButton icon="menu" onClick={onSideBarOpen} />}
        />

        <SideBar
          anchor={SIDEBAR_DESKTOP_ANCHOR}
          open={sidebarOpen}
          variant={sidebarVariant}
          onClose={onSideBarClose}
        />
      </Stack>

      <Stack component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PrivateLayout;
