import { ErrorBoundary } from '@/components';
import { useOnMobile } from '@/hooks/layout';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import TopBar from './TopBar';
import FixSideBar from './SideBar/FixSideBar';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();

  const title = TITLE_PRIVATE;
  document.title = title; // Also Update Tab Title

  return (
    <Stack
      sx={{
        height: '100vh',
        paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <TopBar home={title} />

      <Stack direction="row" component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <FixSideBar />
        <Stack flex={1}>
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PrivateLayout;
