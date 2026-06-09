import { recoverPassword } from '@/services/login';
import { localStorageGet, localStorageSet } from '@/utils';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useRecoverySubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        toast.success(t('auth.forgotPassword.success', { var: t('auth.forgotPassword.successfulEmail') }));
        navigate('/', { replace: true });
      } else {
        toast.error(t('errors.default'));
      }
    } catch {
      toast.error(t('errors.default'));
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  return { onSubmit, isLoading };
};
