import { AppIcon, AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import { Button, Chip, Divider, Drawer, Stack } from '@mui/material';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { drawerPaperStyles } from './styles';
import { DrawerSideBarProps } from './types';
import SideBarContent from './SideBarContent';
import { localStorageGet } from '@/utils';
import { useAppStore } from '@/store';
import BugButton from '@/components/Buttons/BugButton';

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
      slotProps={{ paper: { sx: drawerPaperStyles(onMobile, variant) } }}
      onClose={onClose}
      {...restOfProps}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} pl={2.5}>
        <LocaleSwitch />
        <AppIconButton icon="close" onClick={onClose} title={t('actions.close')} />
      </Stack>
      <Divider />
      {isAuthenticated && <UserInfo />}
      <Divider />
      <SideBarContent onClose={onClose} />
      <Divider />
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
        <BugButton target={location.pathname} />
        <AppIconButton onClick={window.print} icon="print" title={t('actions.print')} />
        <AppIconButton
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
        />
        <AppIconButton onClick={onLogout} icon="logout" title={t('auth.logout')} />
      </Stack>
    </Drawer>
  );
};

export default memo(SideBar);
