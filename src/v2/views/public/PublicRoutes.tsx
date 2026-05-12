import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import LoginView from '@/v2/views/public/Login';
import { Route, Routes } from 'react-router-dom';
import NotFoundView from './NotFound';
import RecoverPasswordView from './Recovery';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceGuard();

  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/recovery" element={<RecoverPasswordView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
