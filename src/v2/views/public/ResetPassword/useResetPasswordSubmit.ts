import { changePassword } from '@/services/auth';
import { useAppStore } from '@/store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export type ResetPasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const useResetPasswordSubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [, dispatch] = useAppStore();
  const [error, setError] = useState<string>('');

  const tmpToken: string | undefined = location.state?.tmp_jwt;

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError('');

    const result = await changePassword(data.oldPassword, data.newPassword, tmpToken);

    if (result.error) {
      const isMinLengthError =
        result.error === t('errors.noData') ||
        (result.error.includes('Password must be at least') && result.error.includes('characters long'));

      setError(isMinLengthError ? t('forms.validation.minLength', { var: 12 }) : result.error);
      return;
    }

    dispatch({ type: 'ADD_POPUP', message: { message: t('auth.password.success'), type: 'success' } });
    navigate('/', { replace: true });
  };

  return { onSubmit, error, setError };
};
