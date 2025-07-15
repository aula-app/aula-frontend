import { AppIcon, AppIconButton } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import { useEventLogout, useEventSwitchDarkMode } from '@/hooks';
import { useAppStore } from '@/store';
import { announceToScreenReader, localStorageGet } from '@/utils';
import { Button, Divider, Stack } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarContent from './SideBarContent';
import { fixedSideBarStyles } from './styles';
import { getConfig } from '../../config';
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
    <Stack
      className="noPrint"
      sx={fixedSideBarStyles}
      role="navigation"
      aria-label={t('ui.navigation.sidebar')}
      id="fixed-sidebar"
      {...restOfProps}
    >
      {getConfig("IS_MULTI") && (
        <>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(code);
              // Announce copy success to screen readers
              announceToScreenReader(t('ui.accessibility.codeCopied'), 'polite');
            }}
            color="secondary"
            aria-label={t('ui.accessibility.copyInstanceCode', { code })}
          >
            {`${t('instance.chip')}: ${code}`}
          </Button>
          <Divider role="presentation" />
        </>
      )}
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
        aria-label={t('auth.logout')}
      >
        {t('auth.logout')}&nbsp;
        <AppIcon icon="logout" aria-hidden="true" />
      </Button>
    </Stack>
  );
};

export default memo(SideBarFixed);
