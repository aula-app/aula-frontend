import { recoverPassword } from '@/services/login';
import { useAppStore } from '@/store';
import { localStorageGet, localStorageSet } from '@/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useRecoverySubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  if (searchParams.has('code')) {
    localStorageSet('code', searchParams.get('code'));
  }

  const onSubmit = async (formData: { email: string }) => {
    setLoading(true);
    const controller = new AbortController();

    try {
      const response = await recoverPassword(
        localStorageGet('api_url'),
        formData.email,
        localStorageGet('token'),
        controller.signal
      );

      if (response.success) {
        dispatch({
          type: 'ADD_POPUP',
          message: {
            message: t('auth.forgotPassword.success', { var: t('auth.forgotPassword.successfulEmail') }),
            type: 'success',
          },
        });
        navigate('/', { replace: true });
      } else {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      }
    } catch {
      dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return { onSubmit, isLoading };
};
