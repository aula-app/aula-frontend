import { localStorageGet, localStorageSet } from '@/utils';
import { NotFoundView } from '@/views/Public';
import AuthView from '@/views/Public/Auth';
import LoginRoutes from '@/views/Public/Login';
import OAuthLogin from '@/views/Public/OAuthLogin';
import RecoveryRoutes from '@/views/Public/Recovery';
import InstanceCodeView from '@/views/Public/InstanceCodeView';
import SetPasswordView from '@/views/Public/SetPassword';
import ChangePasswordView from '@/views/UpdatePassword';

import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    const instance_token = localStorageGet('code', false);

    if (import.meta.env.VITE_APP_MULTI != 'false') {
      if (!instance_token && location.pathname != '/code') navigate('/code');
    } else {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', import.meta.env.VITE_APP_API_URL);
    }
  });

  return (
    <Routes>
      <Route path="/" element={<LoginRoutes />} />
      <Route path="/code" element={<InstanceCodeView />} />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="recovery/*" element={<RecoveryRoutes />} />
      <Route path="password/" element={<ChangePasswordView />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="auth" element={<AuthView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
