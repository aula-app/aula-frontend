import { getRuntimeConfig, loadRuntimeConfig, RuntimeConfig } from '@/config';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { checkPasswordKey, setPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { localStorageGet, localStorageSet } from '@/utils';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export type SetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export const useSetPasswordSubmit = () => {
  const { t } = useTranslation();
  const { key } = useParams();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [searchParams] = useSearchParams();
  const [isValid, setValid] = useState(true);
  const [error, setError] = useState<string>('');

  if (searchParams.has('code')) {
    localStorageSet('code', searchParams.get('code'));
  }

  const validateKey = async () => {
    if (!key) {
      setValid(false);
      return;
    }

    let runtimeConfig: RuntimeConfig;
    try {
      runtimeConfig = getRuntimeConfig();
    } catch (err) {
      runtimeConfig = await loadRuntimeConfig();
    }

    if (!localStorageGet('api_url')) {
      if (runtimeConfig.IS_MULTI) {
        await validateAndSaveInstanceCode(localStorageGet('code'));
      } else {
        localStorageSet('api_url', runtimeConfig.CENTRAL_API_URL);
      }
    }

    try {
      const response = await checkPasswordKey(key);
      if (response.error) {
        setValid(false);
      }
    } catch (error) {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      setValid(false);
    }
  };

  useEffect(() => {
    validateKey();
  }, [key]);

  const onSubmit = async (data: SetPasswordFormValues, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    if (!key) return;

    const result = await setPassword(data.newPassword, key);

    if (result.error) {
      setError(t(result.error));
      return;
    }

    dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.success'), type: 'success' } });
    navigate('/', { replace: true });
  };

  return { isValid, setValid, error, onSubmit };
};
