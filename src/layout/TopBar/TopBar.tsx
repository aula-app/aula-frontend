import { AppIconButton, AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { AppBar, Box, Breadcrumbs, Stack, Toolbar } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { SIDEBAR_DESKTOP_ANCHOR, TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from '../config';
import UserInfo from '@/components/UserInfo';
import MessagesButton from '@/components/Buttons/MessagesButton';
import UpdatesButton from '@/components/Buttons/UpdatesButton';

// Paths that should be excluded from breadcrumbs
const EXCLUDED_PATHS = ['welcome', 'phase', 'settings'];

interface Props {
  /** Home path for navigation */
  home: string;
}

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar: React.FC = () => {
  const [openSideBar, setSidebar] = useState(false);
  const [appState] = useAppStore();

  const location = useLocation().pathname.split('/');
  const onLogout = useEventLogout();
  const onMobile = useOnMobile();
  const goto = useNavigate();

  const menuToggle = () => setSidebar(!openSideBar);

  // Calculate return path based on current location
  const getReturnPath = () => {
    if (appState.breadcrumb.length >= 2) {
      if (
        appState.breadcrumb[appState.breadcrumb.length - 1][1] != undefined &&
        !appState.breadcrumb[appState.breadcrumb.length - 1][1].endsWith('/phase/0')
      ) {
        return appState.breadcrumb[appState.breadcrumb.length - 2][1];
      }
    }
    return '/';
  };

  let crumbs: ReactNode[] = [];
  if (appState.breadcrumb.length > 1) {
    let index = 0;
    for (let i = 0; i < appState.breadcrumb.length - 1; ++i) {
      let b = appState.breadcrumb[i];
      crumbs.push(
        <AppLink underline="hover" color="inherit" to={b[1]} key={i}>
          {b[0]}
        </AppLink>
      );
      index++;
    }
    crumbs.push(<b key={appState.breadcrumb.length}>{appState.breadcrumb[appState.breadcrumb.length - 1][0]}</b>);
  } else {
    if (appState.breadcrumb.length == 1) crumbs = [<b key="0">{appState.breadcrumb[0][0]}</b>];
  }

  return (
    <AppBar elevation={0} sx={{ height: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT }}>
      <Toolbar>
        <Box width={56}>
          {/* Logo or Back Button */}
          {location[1] === '' ? (
            <img src={`${import.meta.env.VITE_APP_BASENAME}img/Aula_Icon.svg`} alt="aula" />
          ) : (
            <AppIconButton icon="back" onClick={() => goto(getReturnPath())} />
          )}
        </Box>

        <UserInfo />

        {/* Navigation Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, textAlign: 'center' }}>
          <AppLink underline="hover" color="inherit" to="/">
            aula
          </AppLink>
          {crumbs.map((b) => {
            return b;
          })}
        </Breadcrumbs>

        {/* User Controls */}
        {checkPermissions('system', 'hide') ? (
          <Stack direction="row">
            <LocaleSwitch />
            <AppIconButton icon="logout" onClick={onLogout} />
          </Stack>
        ) : (
          <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
            <MessagesButton />
            <UpdatesButton />
            <AppIconButton icon="menu" onClick={menuToggle} sx={{ display: { xs: 'block', md: 'none' } }} />
          </Stack>
        )}
        <SideBar
          anchor={SIDEBAR_DESKTOP_ANCHOR}
          open={openSideBar}
          variant="temporary"
          onClose={() => setSidebar(false)}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
