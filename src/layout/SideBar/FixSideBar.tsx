import { AppButton, AppIcon, AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { Divider, DrawerProps, Stack } from '@mui/material';
import { FunctionComponent, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarNavList from './SideBarNavList';
import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import { grey } from '@mui/material/colors';

type Props = Pick<DrawerProps, 'anchor' | 'className' | 'open' | 'variant' | 'onClose'>;

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 * @param {string} anchor - 'left' or 'right'
 * @param {boolean} open - the Drawer is visible when true
 * @param {string} variant - variant of the Drawer, one of 'permanent', 'persistent', 'temporary'
 * @param {function} onClose - called when the Drawer is closing
 */
const FixSideBar: FunctionComponent<Props> = ({ anchor, open, variant, onClose, ...restOfProps }) => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const isAuthenticated = useIsAuthenticated();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  return (
    <Stack
      className="noPrint"
      sx={{
        height: '100%',
        pt: 2,
        borderRight: `1px solid ${grey[300]}`,
        width: SIDEBAR_WIDTH,
        display: { xs: 'none', md: 'flex' },
      }}
      {...restOfProps}
    >
      <Stack direction="row" justifyContent="space-between" p={2} pt={0}>
        <AppIconButton color="secondary" onClick={window.print} icon="print" title={t('generics.print')} />
        <AppIconButton
          color="secondary"
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('generics.modeLight') : t('generics.modeDark')}
        />
        <LocaleSwitch />
      </Stack>
      <Divider />

      <SideBarNavList />

      <Divider />

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isAuthenticated && (
          <AppButton variant="text" onClick={onLogout}>
            {t('generics.logout')}&nbsp;
            <AppIcon icon="logout" />
          </AppButton>
        )}
      </Stack>
    </Stack>
  );
};

export default FixSideBar;
