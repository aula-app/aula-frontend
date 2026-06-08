import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import AboutView from '@/v2/views/public/About';
import InstanceCodeView from '@/v2/views/public/Code';
import Login from '@/v2/views/public/Login';
import NotFound from '@/v2/views/public/NotFound';
import OfflineView from '@/v2/views/public/Offline';
import Recovery from '@/v2/views/public/Recovery/RecoveryView';
import ResetPasswordView from '@/v2/views/public/ResetPassword';
import SetPasswordView from '@/v2/views/public/SetPassword';
import { OAuthLogin } from '@/views/Public';

import { Route, Routes } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceGuard();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/about" element={<AboutView />} />
      <Route path="login/*" element={<Login />} />
      <Route path="offline" element={<OfflineView />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="password/" element={<ResetPasswordView />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
