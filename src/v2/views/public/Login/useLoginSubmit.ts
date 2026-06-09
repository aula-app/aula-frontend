import { loginUser } from '@/services/login';
import { useAppStore } from '@/store';
import { localStorageGet, localStorageSet, parseJwt } from '@/utils';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type LoginFormValues = {
  username: string;
  password: string;
};

export const useLoginSubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (formData: LoginFormValues) => {
    const instanceApiUrl = await localStorageGet('api_url');

    if (!instanceApiUrl) {
      toast.error(t('errors.noServer'));
      return;
    }

    try {
      setLoading(true);

      const jwt_token = localStorageGet('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await loginUser(instanceApiUrl, formData, jwt_token, controller.signal);
      clearTimeout(timeoutId);
      setLoading(false);

      if (response.online_mode !== undefined && response.online_mode !== 1) {
        navigate('/offline', { replace: true });
        return;
      }

      if (response.data || !('JWT' in response)) {
        const message =
          'user_status' in response && response.user_status !== null
            ? response.user_status === 0
              ? t('errors.accountInactive')
              : t('errors.accountSuspended', {
                  var: response.data ? t('errors.accountSuspendDate', { var: response.data }) : '',
                })
            : t('errors.invalidCredentials');
        toast.error(message);
        return;
      }

      const responseJWT = parseJwt(response.JWT || '');

      if (responseJWT?.temp_pw) {
        navigate(`/password`, { replace: true, state: { tmp_jwt: response.JWT } });
        return;
      }

      localStorageSet('token', response.JWT);
      dispatch({ type: 'LOG_IN' });
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      if (e instanceof Error) {
        if (e.name === 'AbortError') {
          toast.error(t('errors.timeout'));
        } else if (e.name === 'NetworkError') {
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.default'));
        }
      }
    }
  };

  return { onSubmit, isLoading };
};
