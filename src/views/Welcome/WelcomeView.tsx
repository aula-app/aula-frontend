import { useAppStore } from '@/store';
import { Stack } from '@mui/material';
import { UIEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/usePageTitle';
import Rooms from '@/v2/views/private/Rooms';
import Dashboard from './Dashboard';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [isDashboardOpen, setDashboardOpen] = useState(true);
  usePageTitle('pageTitles.welcome');

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
  }, [dispatch]);

  const handleRoomsScroll = (e: UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Collapsing grows the list; if it then fits, scrollTop snaps to 0 and must not reopen the dashboard.
    if (scrollHeight <= clientHeight) return;
    setDashboardOpen(scrollTop === 0);
  };

  return (
    <Stack flex={1} role="main" aria-label={t('ui.navigation.home')} sx={{ minHeight: 0, overflow: 'hidden' }}>
      <Dashboard open={isDashboardOpen} onOpenChange={setDashboardOpen} />
      <Rooms onScroll={handleRoomsScroll} />
    </Stack>
  );
};

export default WelcomeView;
