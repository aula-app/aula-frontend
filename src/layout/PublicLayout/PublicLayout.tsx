import { ErrorBoundary } from '@/components';
import SkipNavigation from '@/components/SkipNavigation';
import { Stack, useTheme } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import AulaLogo from './AulaLogo';
import PublicLayoutHeader from './PublicLayoutHeader';

const PublicLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  useEffect(() => {
    document.title = 'aula';
  }, []);

  return (
    <Stack
      mx="auto"
      width="100%"
      p={2}
      maxWidth="20rem"
      sx={{
        height: '100%',
        paddingTop: `calc(${theme.spacing(2)} + var(--safe-area-inset-top, 0px))`,
        paddingLeft: `calc(0px + var(--safe-area-inset-left, 0px))`,
        paddingRight: `calc(0px + var(--safe-area-inset-right, 0px))`,
        paddingBottom: `calc(${theme.spacing(2)} + var(--safe-area-inset-bottom, 0px))`,
      }}
    >
      <SkipNavigation mainContentId="public-content" />
      <Stack>
        <PublicLayoutHeader />
        <AulaLogo />
      </Stack>
      <Stack
        flex={1}
        component="main"
        id="public-content"
        width="100%"
        sx={{
          padding: 1,
          justifyContent: 'center',
        }}
        tabIndex={-1}
      >
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default PublicLayout;
