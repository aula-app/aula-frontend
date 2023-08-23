import { useState, useCallback, FunctionComponent, PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { AppIcon, AppIconButton, ErrorBoundary } from '../components';
import { LinkToPage } from '../utils/type';
import { useOnMobile } from '../hooks/layout';
import {
  SIDEBAR_DESKTOP_ANCHOR,
  SIDEBAR_MOBILE_ANCHOR,
  SIDEBAR_WIDTH,
  TOPBAR_DESKTOP_HEIGHT,
  TOPBAR_MOBILE_HEIGHT,
} from './config';
import TopBar from './TopBar';
import SideBar from './SideBar';

const TITLE_PRIVATE = 'aula';

/**
 * SideBar navigation items with links
 */
const SIDEBAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'Home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'Profile',
    path: '/user',
    icon: 'account',
  },
  {
    title: 'Users',
    path: '/users',
    icon: 'users',
  },
  {
    title: 'Groups',
    path: '/groups',
    icon: 'group',
  },
  {
    title: 'Rooms',
    path: '/rooms',
    icon: 'room',
  },
  {
    title: 'Ideas',
    path: '/ideas',
    icon: 'idea',
  },
  {
    title: 'Texts',
    path: '/texts',
    icon: 'texts',
  },
  {
    title: 'About',
    path: '/about',
    icon: 'info',
  },
  // {
  //   title: 'Dev Tools',
  //   path: '/dev',
  //   icon: 'settings',
  // },
];

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

  const location = useLocation().pathname.replaceAll("/", " ")

  const onSideBarOpen = () => {
    console.log("OPEN", sideBarVisible)
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
        paddingLeft: sidebarOpen && SIDEBAR_DESKTOP_ANCHOR.includes('left') ? SIDEBAR_WIDTH : 0,
        paddingRight: sidebarOpen && SIDEBAR_DESKTOP_ANCHOR.includes('right') ? SIDEBAR_WIDTH : 0,
      }}
    >
      <Stack component="header">
        <TopBar
          startNode={
            location === " " ?
              <AppIcon icon="logo" />
            : <AppIconButton icon="back" onClick={() => navigation(-1)} />
          }
          title={location === " " ? title : location}
          endNode={<AppIconButton icon="menu" onClick={onSideBarOpen} />}
        />

        <SideBar
          anchor={SIDEBAR_DESKTOP_ANCHOR}
          open={sidebarOpen}
          variant={sidebarVariant}
          items={SIDEBAR_ITEMS}
          onClose={onSideBarClose}
        />
      </Stack>

      <Stack
        component="main"
        sx={{ flexGrow: 1, overflow: 'hidden' }}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PrivateLayout;
