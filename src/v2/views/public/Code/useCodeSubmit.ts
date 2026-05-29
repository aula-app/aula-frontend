import { validateAndSaveInstanceCode } from '@/services/instance';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type LoginFormValues = {
  instanceCode: string;
};

export const useCodeSubmit = (setFormError: (field: keyof LoginFormValues, error: { type: string; message: string }) => void) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (data: { instanceCode: string }) => {
    setLoading(true);
    try {
      const isValid = await validateAndSaveInstanceCode(data.instanceCode.trim());
      if (isValid) {
        navigate('/');
      } else {
        setFormError('instanceCode', { type: 'manual', message: t('errors.default') });
        toast.error(t('errors.default'));
      }
    } catch {
      setFormError('instanceCode', { type: 'manual', message: t('instance.error') });
      toast.error(t('instance.error'));
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, isLoading };
};
