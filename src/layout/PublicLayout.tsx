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
    <Box
      bgcolor="#fff"
      width="100%"
      height="100vh"
      overflow="auto"
      sx={{ paddingTop: onMobile ? TOPBAR_MOBILE_HEIGHT : TOPBAR_DESKTOP_HEIGHT }}
    >
      <Stack
        height="100%"
        mx="auto"
        maxWidth="18rem"
        sx={{
          padding: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', flexGrow: 1, mb: 2 }}>
          <img src="./logo-text.svg" alt="aula" />
        </Box>
        <Stack component="main" sx={{ flexGrow: 1 }} width="100%">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </Stack>
        <Box sx={{ flexGrow: 1, minHeight: "5rem", width: "100%" }}></Box>
      </Stack>
    </Box>
  );
};

export default PublicLayout;
