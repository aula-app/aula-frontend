import { NotFoundView } from '@/views/Public';
import LoginRoutes from '@/views/Public/Login';
import RecoveryRoutes from '@/views/Public/Recovery';
import SetPasswordView from '@/views/Public/SetPassword';
import { Route, Routes } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginRoutes />} />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="recovery/*" element={<RecoveryRoutes />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
