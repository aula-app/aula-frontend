import { AppIconButton, AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { AppBar, Box, Breadcrumbs, Stack, Toolbar, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../SideBar';
import { SIDEBAR_DESKTOP_ANCHOR, TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from '../../config';
import { getRuntimeConfig } from '@/config';
import MessagesButton from '@/components/Buttons/MessagesButton';
import UpdatesButton from '@/components/Buttons/UpdatesButton';
import { useTranslation } from 'react-i18next';

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
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
    appState.breadcrumb.forEach((b, i) => {
      crumbs.push(
        <AppLink
          underline="hover"
          color="inherit"
          to={b[1]}
          key={i}
          sx={{
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {b[0]}
        </AppLink>
      );
    });
  } else {
    if (appState.breadcrumb.length == 1) crumbs = [<b key="0">{appState.breadcrumb[0][0]}</b>];
  }

  return (
    <AppBar
      elevation={0}
      sx={{
        height: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
        top: 'var(--safe-area-inset-top, 0px)',
        left: 'var(--safe-area-inset-left, 0px)',
        right: 'var(--safe-area-inset-right, 0px)',
      }}
    >
      <Toolbar>
        <Stack height="100%" direction="row" alignItems="center" pl={0.5} pr={onMobile ? 2 : 3.5}>
          {/* Logo or Back Button */}
          {location[1] === '' ? (
            <img
              src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
              alt={t('app.name.icon')}
              style={{
                height: '100%',
                objectFit: 'contain',
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
              }}
            />
          ) : (
            <AppIconButton icon="back" title={t('tooltips.back')} onClick={() => goto(getReturnPath())} />
          )}
        </Stack>
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            overflow: 'hidden',
            flexGrow: 1,
            textAlign: 'center',
            '& .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
              width: '100%',
            },
            '& .MuiBreadcrumbs-li': {
              minWidth: 0,
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <AppLink
            underline="hover"
            color="inherit"
            to="/"
            sx={{
              display: 'inline-block',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            aula
          </AppLink>
          {crumbs.length > 2 && <span>...</span>}
          {crumbs.slice(-2).map((crumb) => crumb)}
        </Breadcrumbs>

        {/* User Controls */}
        {checkPermissions('system', 'hide') ? (
          <Stack direction="row">
            <LocaleSwitch />
            <AppIconButton icon="logout" title={t('tooltips.logout')} onClick={onLogout} />
          </Stack>
        ) : (
          <Stack direction="row" sx={{ ml: 'auto', gap: 0.5 }}>
            <MessagesButton />
            <UpdatesButton />
            <AppIconButton
              icon="menu"
              title={t('tooltips.menu')}
              onClick={menuToggle}
              sx={{ display: { xs: 'block', md: 'none' } }}
            />
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
