import { useInstanceGuard } from '@/hooks/useInstanceGuard';
import { InstanceCodeView, Login, OAuthLogin, PublicNotFoundView, Recovery, SetPassword } from '@/views/Public';
import PublicOfflineView from '@/views/Public/PublicOfflineView';
import UpdatePasswordView from '@/views/Public/UpdatePassword';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSsoRequired } from '@/hooks';

/** Recovery is unavailable only where SSO is enforced; send those users back to login. */
const RecoveryGuard = () => {
  const isSsoRequired = useSsoRequired();
  return isSsoRequired ? <Navigate to="/login" replace /> : <Recovery />;
};

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
      <Route path="recovery/*" element={<RecoveryGuard />} />
      <Route path="*" element={<PublicNotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
