import { AppIconButton } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import CodeButton from '@/components/Buttons/CodeButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Divider, Drawer, Stack } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarContent from './SideBarContent';
import { drawerPaperStyles } from './styles';
import { DrawerSideBarProps } from './types';

/**
 * Renders SideBar with Menu and User details for authenticated users in Private Layout
 * @component SideBar
 * @param {DrawerSideBarProps} props - Component props
 * @param {('left'|'right')} props.anchor - Drawer anchor position
 * @param {boolean} props.open - Controls drawer open state
 * @param {('permanent'|'persistent'|'temporary')} props.variant - Drawer variant
 * @param {function} props.onClose - Callback when drawer closes
 * @returns {JSX.Element} Rendered SideBar component
 */
const SideBar = ({ anchor, open, variant, onClose, ...restOfProps }: DrawerSideBarProps): JSX.Element => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const code = localStorageGet('code');
  const isAuthenticated = useIsAuthenticated();
  const onMobile = useOnMobile();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  return (
    <Drawer
      className="noPrint"
      anchor={anchor}
      open={open}
      variant={variant}
      slotProps={{
        paper: {
          sx: drawerPaperStyles(onMobile, variant),
          'aria-label': t('ui.navigation.sidebar'),
          role: 'region',
        },
        backdrop: {
          'aria-hidden': 'true', // Hide backdrop from screen readers
        },
      }}
      onClose={onClose}
      id="main-navigation-drawer"
      aria-modal={variant === 'temporary' ? true : undefined}
      {...restOfProps}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} pl={2.5}>
        <LocaleSwitch />
        <AppIconButton
          icon="close"
          onClick={(e) => onClose(e, 'backdropClick')}
          title={t('actions.close')}
          aria-label={t('actions.close')}
          autoFocus={onMobile} // Immediately focus the close button on mobile
          sx={{
            '&:focus-visible': {
              outline: (theme) => `2px solid ${theme.palette.primary.main}`,
            },
          }}
        />
      </Stack>
      <Divider role="presentation" />
      {isAuthenticated && <UserInfo />}
      <Divider role="presentation" />
      <SideBarContent onClose={onClose} />
      <Divider role="presentation" />
      <CodeButton />
      <Stack
        direction="row"
        justifyContent="space-between"
        px={2}
        pt={0}
        role="toolbar"
        aria-label={t('ui.accessibility.sidebarActions')}
      >
        <BugButton target={location.pathname} />
        <AppIconButton onClick={window.print} icon="print" title={t('actions.print')} aria-label={t('actions.print')} />
        <AppIconButton
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
          aria-label={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
        />
        <AppIconButton onClick={onLogout} icon="logout" title={t('auth.logout')} aria-label={t('auth.logout')} />
      </Stack>
    </Drawer>
  );
};

export default memo(SideBar);
