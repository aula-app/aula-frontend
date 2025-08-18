import { ErrorBoundary } from '@/components';
import { checkPermissions } from '@/utils';
import { Stack } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';
import SideBarFixed from './SideBar/SideBarFixed';

const MainContent: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <Stack direction="row" component="main" id="main-content" sx={{ flexGrow: 1, overflow: 'hidden' }} tabIndex={-1}>
      {!checkPermissions('system', 'hide') && <SideBarFixed />}
      <Stack flex={1} overflow="hidden">
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Stack>
    </Stack>
  );
};

export default MainContent;
