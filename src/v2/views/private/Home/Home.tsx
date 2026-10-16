import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store';
import Dashboard from '@/v2/components/dashboard/Dashboard';
import Rooms from '@/v2/views/private/Rooms';
import { UIEvent, useEffect, useState } from 'react';

const Home = () => {
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Dashboard open={isDashboardOpen} onOpenChange={setDashboardOpen} />
      <Rooms onScroll={handleRoomsScroll} />
    </div>
  );
};

export default Home;
