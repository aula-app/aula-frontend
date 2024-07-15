import { FunctionComponent, useCallback, MouseEvent } from 'react';
import { Stack, Divider, Drawer, DrawerProps, FormControlLabel, Switch, Tooltip, Button } from '@mui/material';
import { AppButton, AppIcon, AppIconButton } from '@/components';
import { useAppStore } from '@/store/AppStore';
import { LinkToPage } from '@/types/PageLinks';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import SideBarNavList from './SideBarNavList';
import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import UserInfo from '@/components/UserInfo';
import { useTranslation } from 'react-i18next';
import LocaleSwitch from '@/components/LocaleSwitch';

type Props = Pick<DrawerProps, 'anchor' | 'className' | 'open' | 'variant' | 'onClose'>;

/**
 * SideBar navigation items with links
 */
const SIDEBAR_ITEMS: Array<LinkToPage> = [
  {
    title: 'home',
    path: '/',
    icon: 'home',
  },
  {
    title: 'profile',
    path: '/settings/profile',
    icon: 'account',
  },
  {
    title: 'users',
    path: '/settings/users',
    icon: 'group',
  },
  {
    title: 'rooms',
    path: '/settings/rooms',
    icon: 'room',
  },
  {
    title: 'boxes',
    path: '/settings/boxes',
    icon: 'box',
  },
  {
    title: 'ideas',
    path: '/settings/ideas',
    icon: 'idea',
  },
  {
    title: 'messages',
    path: '/settings/messages',
    icon: 'message',
  },
  {
    title: 'about',
    path: '/about',
    icon: 'info',
  },
];

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 * @param {string} anchor - 'left' or 'right'
 * @param {boolean} open - the Drawer is visible when true
 * @param {string} variant - variant of the Drawer, one of 'permanent', 'persistent', 'temporary'
 * @param {function} onClose - called when the Drawer is closing
 */
const SideBar: FunctionComponent<Props> = ({ anchor, open, variant, onClose, ...restOfProps }) => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const isAuthenticated = useIsAuthenticated();
  const onMobile = useOnMobile();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleAfterLinkClick = useCallback(
    (event: MouseEvent) => {
      if (variant === 'temporary' && typeof onClose === 'function') {
        onClose(event, 'backdropClick');
      }
    },
    [variant, onClose]
  );

  return (
    <Drawer
      className="noPrint"
      anchor={anchor}
      open={open}
      variant={variant}
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          marginTop: onMobile ? 0 : variant === 'temporary' ? 0 : TOPBAR_DESKTOP_HEIGHT,
          height: onMobile ? '100%' : variant === 'temporary' ? '100%' : `calc(100% - ${TOPBAR_DESKTOP_HEIGHT})`,
        },
      }}
      onClose={onClose}
    >
      <Stack
        sx={{
          height: '100%',
          py: 2,
        }}
        {...restOfProps}
        onClick={handleAfterLinkClick}
      >
        <Stack direction="row" justifyContent="space-between" p={2} pt={0}>
          <LocaleSwitch />
          <Tooltip title={state.darkMode ? t('generics.modeLight') : t('generics.modeDark')}>
            <AppIconButton color="secondary" onClick={onSwitchDarkMode} icon={state.darkMode ? 'day' : 'night'} />
          </Tooltip>
          <Tooltip title={t('generics.close')}>
            <AppIconButton color="secondary" onClick={() => {}} icon="close" />
          </Tooltip>
        </Stack>
        {isAuthenticated && (
          <>
            <UserInfo />
            <Divider />
          </>
        )}

        <SideBarNavList items={SIDEBAR_ITEMS} showIcons />

        <Divider />

        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tooltip title={t('generics.print')} sx={{ mx: 2 }}>
            <AppIconButton color="secondary" onClick={window.print} icon="print" />
          </Tooltip>
          {isAuthenticated && (
            <AppButton variant="text" onClick={onLogout}>
              {t('generics.logout')}&nbsp;
              <AppIcon icon="logout" />
            </AppButton>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SideBar;
