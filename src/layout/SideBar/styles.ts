import { SIDEBAR_WIDTH, TOPBAR_DESKTOP_HEIGHT } from '../config';
import { grey } from '@mui/material/colors';

export const drawerPaperStyles = (onMobile: boolean, variant: 'permanent' | 'persistent' | 'temporary') => ({
  minWidth: SIDEBAR_WIDTH,
  marginTop: onMobile ? 0 : variant === 'temporary' ? 0 : TOPBAR_DESKTOP_HEIGHT,
  height: onMobile ? '100%' : variant === 'temporary' ? '100%' : `calc(100% - ${TOPBAR_DESKTOP_HEIGHT})`,
});

const contentStackStyles = {
  height: '100%',
};

const actionStackStyles = {
  display: 'flex',
  flexDirection: 'row' as const,
  justifyContent: 'center',
  alignItems: 'center',
};

export const fixedSideBarStyles = {
  height: '100%',
  borderRight: `1px solid ${grey[300]}`,
  minWidth: SIDEBAR_WIDTH,
  display: { xs: 'none', md: 'flex' },
};

const navListStyles = {
  flex: 1,
  px: 1,
};
