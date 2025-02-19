import { AppIcon, AppIconButton, AppLink } from '@/components';
import BugButton from '@/components/Buttons/BugButton';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { Fragment, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_ITEMS } from '../config';

type Props = {
  isFixed?: boolean;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBarContent
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBarContent component
 */
const SideBarContent = ({ isFixed = false, onClose = () => {}, ...restOfProps }: Props): JSX.Element => {
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
        {SIDEBAR_ITEMS.map(({ icon, path, title, permission }) => (
          <Fragment key={`${title}-${path}`}>
            {permission() && (
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
        {isAuthenticated && (
          <Button onClick={onLogout} sx={{ py: 1, width: '100%', color: 'inherit' }}>
            {t('auth.logout')}&nbsp;
            <AppIcon icon="logout" />
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(SideBarContent);
