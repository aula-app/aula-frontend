import { FunctionComponent, useCallback, MouseEvent } from 'react';
import { Stack, Divider, Drawer, DrawerProps, FormControlLabel, Switch, Tooltip, Button } from '@mui/material';
import { AppButton, AppIcon, AppIconButton } from '@/components';
import { useAppStore } from '@/store/AppStore';
import { LinkToPage } from '@/types/PageLinks';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import SideBarNavList from './SideBarNavList';
import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import UserInfo from '@/components/UserInfo';

type Props = Pick<DrawerProps, 'anchor' | 'className' | 'open' | 'variant' | 'onClose'>;

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
    path: '/settings/profile',
    icon: 'account',
  },
  {
    title: 'Users',
    path: '/settings/users',
    icon: 'group',
  },
  {
    title: 'Rooms',
    path: '/settings/rooms',
    icon: 'room',
  },
  {
    title: 'Ideas',
    path: '/settings/ideas',
    icon: 'idea',
  },
  {
    title: 'Boxes',
    path: '/settings/boxes',
    icon: 'box',
  },
  {
    title: 'Messages',
    path: '/settings/messages',
    icon: 'message',
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
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 * @param {string} anchor - 'left' or 'right'
 * @param {boolean} open - the Drawer is visible when true
 * @param {string} variant - variant of the Drawer, one of 'permanent', 'persistent', 'temporary'
 * @param {function} onClose - called when the Drawer is closing
 */
const SideBar: FunctionComponent<Props> = ({ anchor, open, variant, onClose, ...restOfProps }) => {
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
        <Stack direction="row" pb={2}>
          <Tooltip title={state.darkMode ? 'Light mode' : 'Dark mode'}>
            <Button color="secondary" onClick={onSwitchDarkMode}>
              <AppIcon icon={state.darkMode ? 'day' : 'night'} />
            </Button>
          </Tooltip>
          <Tooltip title="Print" sx={{ mx: 'auto' }}>
            <Button color="secondary" onClick={window.print}>
              <AppIcon icon="print" />
            </Button>
          </Tooltip>
          <Tooltip title="Close">
            <Button color="secondary" onClick={() => {}}>
              <AppIcon icon="Close" />
            </Button>
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
            justifyContent: 'end',
            alignItems: 'center',
          }}
        >
          {isAuthenticated && (
            <AppButton variant="text" onClick={onLogout}>
              LogOut&nbsp;
              <AppIcon icon="logout" />
            </AppButton>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default SideBar;
