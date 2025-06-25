import { localStorageGet, localStorageSet } from '@/utils';
import { InstanceCodeView, Login, OAuthLogin, PublicNotFoundView, Recovery, SetPassword } from '@/views/Public';
import UpdatePasswordView from '@/views/Public/UpdatePassword';
import { useEffect } from 'react';
import { getConfig } from '../config';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const useInstanceCheck = () => {
    const instance_token = localStorageGet('code', false);
    const isMultiInstance = getConfig().IS_MULTI;

    if (isMultiInstance) {
      if (!instance_token && location.pathname !== '/code') {
        navigate('/code');
      }
    } else {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', getConfig().API_URL);
    }
  };

  useEffect(() => {
    useInstanceCheck();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/code" element={<InstanceCodeView />} />
      <Route path="login/*" element={<Login />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="password/" element={<UpdatePasswordView />} />
      <Route path="password/:key" element={<SetPassword />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="*" element={<PublicNotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
