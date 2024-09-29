import { NotFoundView } from '@/views/Public';
import LoginRoutes from '@/views/Public/Login';
import RecoveryRoutes from '@/views/Public/Recovery';
import InstanceCodeView from '@/views/Public/InstanceCodeView';
import SetPasswordView from '@/views/Public/SetPassword';
import SignupRoutes from '@/views/Public/Signup';
import { localStorageGet, localStorageSet } from '@/utils';

import { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

/**
 * List of routes available only for anonymous users
 */
const PublicRoutes = () => {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    const instance_token = localStorageGet('code', false);

    if (import.meta.env.VITE_APP_MULTI != 'false') {
      if (!instance_token && location.pathname != '/code')
         navigate('/code')
    } else {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', import.meta.env.VITE_APP_API_URL);
    }
  })

  return (
    <Routes>
      <Route path="/" element={<LoginRoutes />} />
      <Route path="/code" element={<InstanceCodeView />} />
      <Route path="signup/*" element={<SignupRoutes />} />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="recovery/*" element={<RecoveryRoutes />} />
      <Route path="password/:key" element={<SetPasswordView />} />
      <Route path="*" element={<NotFoundView />} />
    </Routes>
  );
};

export default PublicRoutes;
