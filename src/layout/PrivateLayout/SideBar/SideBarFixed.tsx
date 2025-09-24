import { AppIcon, AppIconButton } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import CodeButton from '@/components/Buttons/CodeButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode } from '@/hooks';
import { useAppStore } from '@/store';
import { Button, Divider, Stack } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarContent from './SideBarContent';
import { fixedSideBarStyles } from './styles';

/**
 * Renders fixed SideBar with Menu and User details for desktop view
 * @component SideBarFixed
 * @returns {JSX.Element} Rendered SideBarFixed component
 */
const SideBarFixed = ({ ...restOfProps }): JSX.Element => {
  const { t } = useTranslation();
  const [state] = useAppStore();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  return (
    <Stack
      className="noPrint"
      sx={fixedSideBarStyles}
      role="navigation"
      aria-label={t('ui.navigation.sidebar')}
      id="fixed-sidebar"
      {...restOfProps}
    >
      <CodeButton />
      <SideBarContent isFixed={true} />
      <Divider role="presentation" />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={1}
        pl={2.5}
        role="toolbar"
        aria-label={t('ui.accessibility.sidebarActions')}
      >
        <LocaleSwitch />
        <BugButton target={location.pathname} />
        <AppIconButton onClick={window.print} icon="print" title={t('actions.print')} aria-label={t('actions.print')} />
        <AppIconButton
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
          aria-label={state.darkMode ? t('ui.lightMode') : t('ui.darkMode')}
        />
      </Stack>
      <Divider role="presentation" />
      <Button
        onClick={onLogout}
        sx={{
          py: 1,
          width: '100%',
          color: 'inherit',
          justifyContent: 'center',
          '&:focus-visible': {
            outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          },
        }}
        data-testid="logout-button"
        aria-label={t('auth.logout')}
      >
        {t('auth.logout')}&nbsp;
        <AppIcon icon="logout" aria-hidden="true" />
      </Button>
    </Stack>
  );
};

export default memo(SideBarFixed);
