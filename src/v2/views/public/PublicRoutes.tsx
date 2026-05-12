import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import LoginView from '@/v2/views/public/Login';
import { Route, Routes } from 'react-router-dom';
import NotFoundView from './NotFound';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceGuard();

  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
