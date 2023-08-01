import { FunctionComponent, PropsWithChildren } from 'react';
import { Stack } from '@mui/material/';
import { ErrorBoundary } from '../components';
import { useOnMobile } from '../hooks/layout';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import { Box } from '@mui/joy';

const TITLE_PUBLIC = 'aula';

/**
 * Renders "Public Layout" composition
 */
const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const onMobile = useOnMobile();

  const title = TITLE_PUBLIC;
  document.title = title; // Also Update Tab Title

  return (
    <Stack
      bgcolor="#fff"
      sx={{
        minHeight: '100vh', // Full screen height
        padding: 1,
        paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT,
        alignItems: 'center'
      }}
    >
      <Box sx={{width: '100%', maxWidth: '18rem', paddingX: 1, flexGrow: 1}}><img src="./logo-text.svg" alt="aula" /></Box>
      <Stack
        component="main"
        sx={{flexGrow: 1}}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
      <Box sx={{flexGrow: 1}}></Box>
    </Stack>
  );
};

export default PublicLayout;
