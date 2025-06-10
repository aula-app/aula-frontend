import { AppIcon, AppIconButton } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated } from '@/hooks';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Button, Divider, Stack } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarContent from './SideBarContent';
import { fixedSideBarStyles } from './styles';
import LocaleSwitch from '@/components/LocaleSwitch';

/**
 * Renders fixed SideBar with Menu and User details for desktop view
 * @component SideBarFixed
 * @returns {JSX.Element} Rendered SideBarFixed component
 */
const SideBarFixed = ({ ...restOfProps }): JSX.Element => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const code = localStorageGet('code');

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  return (
    <Stack className="noPrint" pt={1} sx={fixedSideBarStyles} {...restOfProps}>
      {import.meta.env.VITE_APP_MULTI !== 'false' && (
        <>
          <Button onClick={() => navigator.clipboard.writeText(code)} color="secondary">
            {`${t('instance.chip')}: ${code}`}
          </Button>
          <Divider />
        </>
      )}
      <Divider />
      <SideBarContent isFixed />
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} pl={2.5}>
        <LocaleSwitch />
        <BugButton target={location.pathname} />
        <AppIconButton onClick={window.print} icon="print" title={t('actions.print')} />
        <AppIconButton
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
        />
      </Stack>
      <Divider />
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onClick={onLogout} sx={{ py: 1, width: '100%', color: 'inherit' }}>
          {t('auth.logout')}&nbsp;
          <AppIcon icon="logout" />
        </Button>
      </Stack>
    </Stack>
  );
};

export default memo(SideBarFixed);
