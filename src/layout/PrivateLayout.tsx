import { ErrorBoundary } from '@/components';
import EditData from '@/components/Data/EditData';
import { useOnMobile } from '@/hooks/layout';
import { checkPermissions, getCurrentUser, localStorageGet, parseJwt } from '@/utils';
import AskConsent from '@/views/AskConsent';
import UpdatePassword from '@/views/UpdatePassword';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TOPBAR_DESKTOP_HEIGHT, TOPBAR_MOBILE_HEIGHT } from './config';
import SideBarFixed from './SideBar/SideBarFixed';
import TopBar from './TopBar';
import PopupMessages from '@/components/PopupMessages';

const TITLE_PRIVATE = 'aula';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [scope, setScope] = useState<'bug' | 'report'>();
  const jwt = parseJwt(localStorageGet('token'));

  const onMobile = useOnMobile();

  const title = TITLE_PRIVATE;
  document.title = title; // Also Update Tab Title

  return jwt.temp_pw ? (
    <UpdatePassword />
  ) : (
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
        {!checkPermissions(60) && <SideBarFixed setReport={setScope} />}
        <Stack flex={1} overflow="hidden">
          <ErrorBoundary name="Content">{children}</ErrorBoundary>
        </Stack>
      </Stack>
      <EditData
        isOpen={!!scope}
        scope={scope || 'bug'}
        otherData={{
          headline: `${scope === 'bug' ? 'Bug' : 'Content'} report`,
          msg_type: 4,
        }}
        metadata={{
          location: location.pathname,
          user: getCurrentUser(),
          userAgent: window.navigator.userAgent,
        }}
        onClose={() => setScope(undefined)}
      />
      <AskConsent />
      <PopupMessages />
    </Stack>
  );
};

export default PrivateLayout;
