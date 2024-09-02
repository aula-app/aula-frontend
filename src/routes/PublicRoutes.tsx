import { NotFoundView } from '@/views/Public';
import AuthView from '@/views/Public/Auth';
import LoginRoutes from '@/views/Public/Login';
import RecoveryRoutes from '@/views/Public/Recovery';
import SetPasswordView from '@/views/Public/SetPassword';
import SignupRoutes from '@/views/Public/Signup';
import { Route, Routes } from 'react-router-dom';

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
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="auth" element={<AuthView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
