import { AppButton, AppIcon, AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { Divider, Stack } from '@mui/material';
import { Dispatch, MouseEvent, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SideBarNavList from './SideBarNavList';

type Props = {
  isFixed?: boolean;
  setReport: Dispatch<SetStateAction<'bug' | 'report' | undefined>>;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 * @param {function} onClose - called when the Drawer is closing
 */
const SideBarContent = ({ isFixed = false, setReport, onClose = () => {}, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const isAuthenticated = useIsAuthenticated();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleAfterLinkClick = useCallback(
    (event: MouseEvent) => {
      onClose(event, 'backdropClick');
    },
    [onClose]
  );

  return (
    <Stack
      sx={{
        height: '100%',
      }}
      {...restOfProps}
      onClick={handleAfterLinkClick}
    >
      <SideBarNavList />
      <Divider />
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
        {isFixed && <LocaleSwitch />}
        <AppIconButton onClick={() => setReport('report')} icon="report" title={t('generics.contentReport')} />
        <AppIconButton onClick={() => setReport('bug')} icon="bug" title={t('generics.bugReport')} />
        <AppIconButton onClick={window.print} icon="print" title={t('generics.print')} />
        <AppIconButton
          onClick={onSwitchDarkMode}
          icon={state.darkMode ? 'day' : 'night'}
          title={state.darkMode ? t('generics.modeLight') : t('generics.modeDark')}
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

export default SideBarContent;
