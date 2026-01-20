import { Link } from 'react-router-dom';
import { AppIconButton, AppLink, Breadcrumb } from '@/components';
import MessagesButton from '@/components/Buttons/MessagesButton';
import UpdatesButton from '@/components/Buttons/UpdatesButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import { getRuntimeConfig } from '@/config';
import { useEventLogout, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { AppBar, Breadcrumbs, Stack, Toolbar, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { SIDEBAR_DESKTOP_ANCHOR, TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from '../../config';
import SideBar from '../SideBar';
import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';

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

  return (
    <header className="bg-primary h-14 flex items-center px-2 py-1 shadow-sm">
      <div className="flex-1 flex items-center justify-start h-full">
        {location[1] === '' ? (
          <IconButton to="/" className="h-full">
            <img
              src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
              alt={t('app.name.icon')}
              className="h-full object-contain"
            />
          </IconButton>
        ) : (
          <IconButton to={getReturnPath()} className="h-full">
            <Icon type="back" size="1.5rem" />
          </IconButton>
        )}
      </div>
      <div className="flex-1 h-full flex items-center justify-center text-lg">
        <Breadcrumb />
      </div>
      <div className="flex-1 h-full flex items-center justify-end"></div>
    </header>
    // <AppBar
    //   elevation={0}
    //   sx={{
    //     height: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
    //     top: 'var(--safe-area-inset-top, 0px)',
    //     left: 'var(--safe-area-inset-left, 0px)',
    //     right: 'var(--safe-area-inset-right, 0px)',
    //   }}
    // >
    //   <Toolbar>
    //     <Stack height="100%" direction="row" alignItems="center" pl={0.5} pr={onMobile ? 2 : 3.5}>
    //       {/* Logo or Back Button */}
    //       {location[1] === '' ? (
    //         <img
    //           src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
    //           alt={t('app.name.icon')}
    //           style={{
    //             height: '100%',
    //             objectFit: 'contain',
    //             paddingTop: theme.spacing(2),
    //             paddingBottom: theme.spacing(2),
    //           }}
    //         />
    //       ) : (
    //         <AppIconButton icon="back" title={t('tooltips.back')} onClick={() => goto(getReturnPath())} />
    //       )}
    //     </Stack>
    //     {/* Navigation Breadcrumbs */}
    //     <Breadcrumbs
    //       aria-label="breadcrumb"
    //       sx={{
    //         overflow: 'hidden',
    //         flexGrow: 1,
    //         textAlign: 'center',
    //         '& .MuiBreadcrumbs-ol': {
    //           flexWrap: 'nowrap',
    //           width: '100%',
    //         },
    //         '& .MuiBreadcrumbs-li': {
    //           minWidth: 0,
    //           maxWidth: '100%',
    //           display: 'flex',
    //           alignItems: 'center',
    //         },
    //       }}
    //     >
    //       <AppLink
    //         underline="hover"
    //         color="inherit"
    //         to="/"
    //         sx={{
    //           display: 'inline-block',
    //           maxWidth: '100%',
    //           overflow: 'hidden',
    //           textOverflow: 'ellipsis',
    //           whiteSpace: 'nowrap',
    //         }}
    //       >
    //         aula
    //       </AppLink>
    //       {crumbs.length > 2 && <span>...</span>}
    //       {crumbs.slice(-2).map((crumb) => crumb)}
    //     </Breadcrumbs>

    //     {/* User Controls */}
    //     {checkPermissions('system', 'hide') ? (
    //       <Stack direction="row">
    //         <LocaleSwitch />
    //         <AppIconButton icon="logout" title={t('tooltips.logout')} onClick={onLogout} />
    //       </Stack>
    //     ) : (
    //       <Stack direction="row" sx={{ ml: 'auto', gap: 0.5 }}>
    //         <MessagesButton />
    //         <UpdatesButton />
    //         <AppIconButton
    //           icon="menu"
    //           title={t('tooltips.menu')}
    //           onClick={menuToggle}
    //           sx={{ display: { xs: 'block', md: 'none' } }}
    //         />
    //       </Stack>
    //     )}
    //     <SideBar
    //       anchor={SIDEBAR_DESKTOP_ANCHOR}
    //       open={openSideBar}
    //       variant="temporary"
    //       onClose={() => setSidebar(false)}
    //     />
    //   </Toolbar>
    // </AppBar>
  );
};

export default TopBar;
