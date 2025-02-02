import { useAppStore } from '@/store';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { handleOAuthLogin } from '@/services/auth';

const OAuthLogin = () => {
  const { jwt_token } = useParams<{ jwt_token?: string }>();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      handleOAuthLogin(jwt_token);
      dispatch({ type: 'LOG_IN' });
      navigate('/', { replace: true });
    } catch (error) {
      navigate('/login', { replace: true });
    }
  }, [jwt_token, dispatch, navigate]);

  return null;
}

export default OAuthLogin;
