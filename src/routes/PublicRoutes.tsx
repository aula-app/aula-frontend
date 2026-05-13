import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import InstanceCodeView from '@/v2/views/public/Code';
import Login from '@/v2/views/public/Login';
import NotFound from '@/v2/views/public/NotFound';
import Recovery from '@/v2/views/public/Recovery/RecoveryView';
import { OAuthLogin, SetPassword } from '@/views/Public';
import PublicOfflineView from '@/views/Public/PublicOfflineView';
import UpdatePasswordView from '@/views/Public/UpdatePassword';
import { Route, Routes } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceGuard();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/code" element={<InstanceCodeView />} />
      <Route path="login/*" element={<Login />} />
      <Route path="offline" element={<PublicOfflineView />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="password/" element={<UpdatePasswordView />} />
      <Route path="password/:key" element={<SetPassword />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
