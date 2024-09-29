import { localStorageGet, localStorageSet } from '@/utils';
import { NotFoundView } from '@/views/Public';
import LoginRoutes from '@/views/Public/Login';
import RecoveryRoutes from '@/views/Public/Recovery';
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
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="recovery/*" element={<RecoveryRoutes />} />
      <Route path="password/" element={<ChangePasswordView />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
