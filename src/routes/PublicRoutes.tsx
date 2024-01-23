import { Route, Routes } from 'react-router-dom';
import { NotFoundView } from '@/views';
import LoginRoutes from '@/views/Public/Login';
import SignupRoutes from '@/views/Public/Signup';
import RecoveryRoutes from '@/views/Public/Recovery';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginRoutes />} />
      <Route path="signup/*" element={<SignupRoutes />} />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="recovery/*" element={<RecoveryRoutes />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
