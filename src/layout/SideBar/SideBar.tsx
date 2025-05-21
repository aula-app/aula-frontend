import { AppIconButton } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Button, Divider, Drawer, Stack } from '@mui/material';
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
      slotProps={{ paper: { sx: drawerPaperStyles(onMobile, variant), 'aria-label': t('ui.navigation.sidebar') } }}
      onClose={onClose}
      role="navigation"
      aria-label={t('ui.navigation.sidebar')}
      {...restOfProps}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} pl={2.5}>
        <LocaleSwitch />
        <AppIconButton
          icon="close"
          onClick={(e) => onClose(e, 'backdropClick')}
          title={t('actions.close')}
          aria-label={t('actions.close')}
        />
      </Stack>
      <Divider />
      {isAuthenticated && <UserInfo />}
      <Divider />
      <SideBarContent onClose={onClose} />
      <Divider />
      {import.meta.env.VITE_APP_MULTI !== 'false' && (
        <>
          <Button onClick={() => navigator.clipboard.writeText(code)} color="secondary">
            {`${t('instance.chip')}: ${code}`}
          </Button>
          <Divider />
        </>
      )}
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
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
