import { localStorageGet, localStorageSet } from '@/utils';
import { InstanceCodeView, Login, OAuthLogin, PublicNotFoundView, Recovery, SetPassword } from '@/views/Public';
import PublicOfflineView from '@/views/Public/PublicOfflineView';
import UpdatePasswordView from '@/views/Public/UpdatePassword';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getRuntimeConfig } from '../config';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const useInstanceCheck = async () => {
    const instanceCode = localStorageGet('code', false);
    const isMultiInstance = getRuntimeConfig().IS_MULTI;

    if (isMultiInstance) {
      // aula-frontend should have its own instanceCode so its aula-backend would
      //   know which database to use
      if (!instanceCode && location.pathname !== '/code') {
        navigate('/code');
      }
    } else {
      localStorageSet('code', 'SINGLE');
      // SINGLE instance aula-frontend that is not connected to the aula network
      //   will only use its own aula-backend
      await localStorageSet('api_url', getRuntimeConfig().CENTRAL_API_URL);
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
      <Route path="offline" element={<PublicOfflineView />} />
      <Route path="oauth-login/:jwt_token" element={<OAuthLogin />} />
      <Route path="password/" element={<UpdatePasswordView />} />
      <Route path="password/:key" element={<SetPassword />} />
      <Route path="recovery/*" element={<Recovery />} />
      <Route path="*" element={<PublicNotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
