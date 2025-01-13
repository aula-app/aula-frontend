import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { localStorageGet, localStorageSet } from '@/utils';
import { PublicNotFoundView, Auth, Login, OAuthLogin, Recovery, InstanceCodeView, SetPassword } from '@/views/Public';
import ChangePasswordView from '@/views/UpdatePassword';

const useInstanceCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const instance_token = localStorageGet('code', false);
    const isMultiInstance = import.meta.env.VITE_APP_MULTI !== 'false';

    if (isMultiInstance) {
      if (!instance_token && location.pathname !== '/code') {
        navigate('/code');
      }
    } else {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', import.meta.env.VITE_APP_API_URL);
    }
  }, [location.pathname, navigate]);
};

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  useInstanceCheck();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/code" element={<InstanceCodeView />} />
      <Route path="login/*" element={<Login />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="password/" element={<ChangePasswordView />} />
      <Route path="password/:key" element={<SetPassword />} />
      <Route path="auth" element={<Auth />} />
      <Route path="*" element={<PublicNotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
