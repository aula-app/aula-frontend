import { AppButton, AppIcon, AppIconButton, AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { Dispatch, Fragment, memo, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_ITEMS } from '../config';

type Props = {
  isFixed?: boolean;
  setReport: Dispatch<SetStateAction<'bugs' | 'reports' | undefined>>;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBarContent
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} props.setReport - Callback to set report type
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBarContent component
 */
const SideBarContent = ({ isFixed = false, setReport, onClose = () => {}, ...restOfProps }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [state] = useAppStore();
  const isAuthenticated = useIsAuthenticated();

  const onSwitchDarkMode = useEventSwitchDarkMode();
  const onLogout = useEventLogout();

  const handleAfterLinkClick = useCallback(
    (event: React.MouseEvent) => {
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
      <List component="nav" {...restOfProps} sx={{ flex: 1, px: 1, overflow: 'auto' }}>
        {SIDEBAR_ITEMS.map(({ icon, path, title, role }) => (
          <Fragment key={`${title}-${path}`}>
            {checkPermissions(role) && (
              <ListItemButton
                component={AppLink}
                to={path}
                href="" // Hard reset for .href property, otherwise links are always opened in new tab :(
                openInNewTab={false}
              >
                <ListItemIcon>{icon && <AppIcon icon={icon} />}</ListItemIcon>
                <ListItemText primary={t(`ui.navigation.${title}`)} />
              </ListItemButton>
            )}
          </Fragment>
        ))}
      </List>
      <Divider />
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
        {isFixed && <LocaleSwitch />}
        <AppIconButton onClick={() => setReport('reports')} icon="report" title={t('actions.contentReport')} />
        <AppIconButton onClick={() => setReport('bugs')} icon="bug" title={t('actions.bugReport')} />
        <AppIconButton onClick={window.print} icon="print" title={t('actions.print')} />
        <AppIconButton onClick={() => setReport('reports')} icon="report" title={t('actions.contentReport')} />
        <AppIconButton onClick={() => setReport('bugs')} icon="bug" title={t('actions.bugReport')} />
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
        {isAuthenticated && (
          <AppButton variant="text" onClick={onLogout}>
            {t('auth.logout')}&nbsp;
            {t('auth.logout')}&nbsp;
            <AppIcon icon="logout" />
          </AppButton>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(SideBarContent);
