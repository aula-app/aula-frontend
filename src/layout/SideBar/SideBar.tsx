import { AppButton, AppIcon, AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated, useOnMobile } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { Divider, Drawer, DrawerProps, Stack } from '@mui/material';
import { FunctionComponent, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import SideBarNavList from './SideBarNavList';

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
          pt: 1,
        }}
        {...restOfProps}
        onClick={handleAfterLinkClick}
      >
        <Stack direction="row" justifyContent="space-between" p={2} pt={0}>
          <AppIconButton color="secondary" onClick={() => {}} icon="close" title={t('generics.close')} sx={{ px: 0 }} />
          <AppIconButton color="secondary" onClick={window.print} icon="print" title={t('generics.print')} />
          <AppIconButton
            color="secondary"
            onClick={onSwitchDarkMode}
            icon={state.darkMode ? 'day' : 'night'}
            title={state.darkMode ? t('generics.modeLight') : t('generics.modeDark')}
          />
          <LocaleSwitch />
        </Stack>
        {isAuthenticated && (
          <>
            <UserInfo />
            <Divider />
          </>
        )}

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
    </Drawer>
  );
};

export default SideBar;
