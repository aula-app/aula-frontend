import { AppButton, AppIcon, AppIconButton, AppLink } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import { useEventLogout, useEventSwitchDarkMode, useIsAuthenticated } from '@/hooks';
import { useAppStore } from '@/store/AppStore';
import { checkPermissions } from '@/utils';
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { Dispatch, Fragment, MouseEvent, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_ITEMS } from '../config';

/**
 * Renders SideBar content including navigation, actions and user controls
 * @component SideBarContent
 * @param {SideBarContentProps} props - Component props
 * @param {boolean} [props.isFixed] - Whether the sidebar is fixed or in a drawer
 * @param {function} props.setReport - Callback to set report type
 * @param {function} [props.onClose] - Optional callback when drawer closes
 * @returns {JSX.Element} Rendered SideBarContent component
 */
const SideBarContent = ({
  isFixed = false,
  setReport,
  onClose = () => {},
  ...restOfProps
}: SideBarContentProps): JSX.Element => {
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
                <ListItemText primary={t(`views.${title}`)} />
              </ListItemButton>
            )}
          </Fragment>
        ))}
      </List>
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
      <Stack sx={actionStackStyles}>
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

export default memo(SideBarContent);
