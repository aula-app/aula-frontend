import { AppIcon, AppIconButton, AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { AppBar, Breadcrumbs, Stack, Toolbar } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { SIDEBAR_DESKTOP_ANCHOR } from '../config';

// Role required for admin features
const TECH_ADMIN_ROLE = 60;

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
    <AppBar elevation={0}>
      <Toolbar>
        {/* Logo or Back Button */}
        {location[1] === '' ? (
          <AppIcon icon="logo" size="large" sx={{ mr: 1 }} />
        ) : (
          <AppIconButton icon="back" onClick={() => goto(getReturnPath())} />
        )}

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
        {checkPermissions(TECH_ADMIN_ROLE) ? (
          <Stack direction="row">
            <LocaleSwitch />
            <AppIconButton icon="logout" onClick={onLogout} />
          </Stack>
        ) : (
          <AppIconButton icon="menu" onClick={menuToggle} sx={{ display: { xs: 'block', md: 'none' } }} />
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
