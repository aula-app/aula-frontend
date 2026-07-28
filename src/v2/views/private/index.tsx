import OfflineView from '@/views/OfflineView';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './Layout';
import { useIsOnline } from '@/hooks/auth';
import PrivateRoutes from '@/routes/PrivateRoutes';

const PrivateLayout: FunctionComponent<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    useIsOnline().then(setOnline);
  }, [location]);

  return !online ? (
    <OfflineView />
  ) : (
    <Layout>
      <PrivateRoutes />
    </Layout>
  );
};

export default PrivateLayout;
