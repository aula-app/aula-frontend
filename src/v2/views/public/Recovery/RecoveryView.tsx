import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useRecoverySubmit } from './useRecoverySubmit';

const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const { onSubmit, isLoading } = useRecoverySubmit();

  const schema = yup.object({
    email: yup.string().email(t('forms.validation.email')).required(t('forms.validation.required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('auth.forgotPassword.recovery')}</h1>
      <fieldset className="rounded-box flex flex-col">
        <TextInput
          required
          disabled={isLoading}
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button
          type="submit"
          disabled={isLoading}
          aria-label={t('auth.forgotPassword.recover')}
          className="bg-secondary"
        >
          {t('auth.forgotPassword.recover')}
        </Button>
      </fieldset>
    </form>
  );
};

export default RecoveryPasswordView;
