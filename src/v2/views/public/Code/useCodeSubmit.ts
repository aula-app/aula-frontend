import { validateAndSaveInstanceCode } from '@/services/instance';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type LoginFormValues = {
  instanceCode: string;
};

export const useCodeSubmit = (setFormError: (field: keyof LoginFormValues, error: { type: string; message: string }) => void) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: { instanceCode: string }) => {
    setLoading(true);
    try {
      const isValid = await validateAndSaveInstanceCode(data.instanceCode.trim());
      if (isValid) {
        navigate('/');
      } else {
        setFormError('instanceCode', { type: 'manual', message: t('errors.default') });
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.default'), type: 'error' } });
      }
    } catch (err) {
      setFormError('instanceCode', { type: 'manual', message: t('instance.error') });
      dispatch({ type: 'ADD_POPUP', message: { message: t('instance.error'), type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, isLoading };
};
