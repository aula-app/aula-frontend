import { AppIconButton } from '@/components';
import LocaleSwitch from '@/components/LocaleSwitch';
import UserInfo from '@/components/UserInfo';
import { useIsAuthenticated, useOnMobile } from '@/hooks';
import { Divider, Drawer, Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import SideBarContent from './SideBarContent';

type Props = {
  anchor: 'left' | 'right';
  open: boolean;
  variant: 'permanent' | 'persistent' | 'temporary';
  setReport: Dispatch<SetStateAction<'bug' | 'report' | undefined>>;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * Renders SideBar with Menu and User details
 * Actually for Authenticated users only, rendered in "Private Layout"
 * @component SideBar
 */
const SideBar = ({ anchor, open, variant, setReport, onClose, ...restOfProps }: Props) => {
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
        sx: {
          width: SIDEBAR_WIDTH,
          marginTop: onMobile ? 0 : variant === 'temporary' ? 0 : TOPBAR_DESKTOP_HEIGHT,
          height: onMobile ? '100%' : variant === 'temporary' ? '100%' : `calc(100% - ${TOPBAR_DESKTOP_HEIGHT})`,
        },
      }}
      onClose={onClose}
    >
      <Stack direction="row" justifyContent="space-between" px={2} pt={0}>
        <LocaleSwitch />
        <AppIconButton color="secondary" onClick={(evt) => onClose(evt, 'backdropClick')} icon="close" title={t('generics.close')} sx={{ px: 0 }} />
      </Stack>
      {isAuthenticated && <UserInfo />}
      <Divider />
      <SideBarContent setReport={setReport} onClose={onClose} />
    </Drawer>
  );
};

export default SideBar;
