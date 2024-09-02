import { ErrorBoundary } from '@/components';
import EditData from '@/components/Data/EditData';
import { useOnMobile } from '@/hooks/layout';
import { getCurrentUser } from '@/utils';
import AskConsent from '@/views/AskConsent/AskConsentView';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import SideBarFixed from './SideBar/SideBarFixed';
import TopBar from './TopBar';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [scope, setScope] = useState<'bug' | 'report'>();

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
      <TopBar home={title} setReport={setScope} />

      <Stack direction="row" component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <SideBarFixed setReport={setScope} />
        <Stack flex={1} overflow="hidden">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </Stack>
      </Stack>
      <EditData
        isOpen={!!scope}
        scope={scope || 'bug'}
        otherData={{
          headline: `${scope === 'bug' ? 'Bug' : 'Content'} report`,
        }}
        metadata={{
          location: location.pathname,
          user: getCurrentUser(),
          userAgent: window.navigator.userAgent,
        }}
        onClose={() => setScope(undefined)}
      />
      <AskConsent />
    </Stack>
  );
};

export default PrivateLayout;
