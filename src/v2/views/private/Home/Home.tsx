import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store';
import Dashboard from '@/v2/components/dashboard/Dashboard';
import { useCollapseOnScroll } from '@/v2/hooks/useCollapseOnScroll';
import Rooms from '@/v2/views/private/Rooms';
import { useEffect } from 'react';

const Home = () => {
  const [, dispatch] = useAppStore();
  const dashboard = useCollapseOnScroll();
  usePageTitle('pageTitles.welcome');

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [] });
  }, [dispatch]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Dashboard open={dashboard.open} onOpenChange={dashboard.setOpen} />
      <Rooms onScroll={dashboard.onScroll} />
    </div>
  );
};

export default Home;
