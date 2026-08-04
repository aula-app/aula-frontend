import { useAppStore } from '@/store';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { localStorageGet } from '@/utils';

const OAuthLogin = () => {
  const { jwt_token } = useParams<{ jwt_token?: string }>();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // IdP-initiated launches (e.g. Eduplaces marketplace) start without
        // an instance code in localStorage. The backend now passes the
        // resolved tenant back as `?code=…`; populate localStorage before
        // entering the app or every subsequent request will be tenantless.
        const codeFromUrl = searchParams.get('code');
        const codeInStorage = localStorageGet('code');
        if (codeFromUrl && codeFromUrl !== codeInStorage) {
          await validateAndSaveInstanceCode(codeFromUrl);
        }

        handleOAuthLogin(jwt_token);
        localStorage.removeItem('sso_force_login');
        dispatch({ type: 'LOG_IN' });
        navigate('/', { replace: true });
      } catch (error) {
        navigate('/login', { replace: true });
      }
    })();
  }, [jwt_token, searchParams, dispatch, navigate]);

  return null;
}

export default OAuthLogin;
