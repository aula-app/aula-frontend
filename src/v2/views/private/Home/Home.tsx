import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store';
import Dashboard from '@/v2/components/dashboard/Dashboard';
import Rooms from '@/v2/views/private/Rooms';
import { UIEvent, useEffect, useRef, useState } from 'react';

const Home = () => {
  const [, dispatch] = useAppStore();
  const [isDashboardOpen, setDashboardOpen] = useState(true);
  const dashboardRef = useRef<HTMLElement>(null);
  usePageTitle('pageTitles.welcome');

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
  }, [dispatch]);

  const handleRoomsScroll = (e: UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Collapsing grows the list; if it then fits, scrollTop snaps to 0 and must not reopen the dashboard.
    if (scrollHeight <= clientHeight) return;
    const open = scrollTop === 0;
    // Collapsing makes the panel inert, which would drop focus held inside it.
    if (!open && dashboardRef.current?.contains(document.activeElement)) return;
    setDashboardOpen(open);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Dashboard ref={dashboardRef} open={isDashboardOpen} onOpenChange={setDashboardOpen} />
      <Rooms onScroll={handleRoomsScroll} />
    </div>
  );
};

export default Home;
