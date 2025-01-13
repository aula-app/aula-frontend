import { AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useIsAuthenticated, useOnMobile } from '@/hooks';
import { Divider, Drawer, Stack } from '@mui/material';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { drawerPaperStyles } from './styles';
import { DrawerSideBarProps } from './types';
import SideBarContent from './SideBarContent';

/**
 * Renders SideBar with Menu and User details for authenticated users in Private Layout
 * @component SideBar
 * @param {DrawerSideBarProps} props - Component props
 * @param {('left'|'right')} props.anchor - Drawer anchor position
 * @param {boolean} props.open - Controls drawer open state
 * @param {('permanent'|'persistent'|'temporary')} props.variant - Drawer variant
 * @param {function} props.setReport - Callback to set report type
 * @param {function} props.onClose - Callback when drawer closes
 * @returns {JSX.Element} Rendered SideBar component
 */
const SideBar = ({ anchor, open, variant, setReport, onClose, ...restOfProps }: DrawerSideBarProps): JSX.Element => {
  const { t } = useTranslation();
  const onMobile = useOnMobile();
  const isAuthenticated = useIsAuthenticated();

  return (
    <Drawer
      className="noPrint"
      anchor={anchor}
      open={open}
      variant={variant}
      PaperProps={{
        sx: drawerPaperStyles(onMobile, variant),
      }}
      onClose={onClose}
      {...restOfProps}
    >
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
        <LocaleSwitch />
        <AppIconButton
          color="secondary"
          onClick={(evt) => onClose(evt, 'backdropClick')}
          icon="close"
          title={t('generics.close')}
          sx={{ px: 0 }}
        />
      </Stack>
      {isAuthenticated && <UserInfo />}
      <Divider />
      <SideBarContent setReport={setReport} onClose={onClose} />
    </Drawer>
  );
};

export default memo(SideBar);
