import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useRecoverySubmit } from './useRecoverySubmit';
import Link from '@/v2/components/navigation/Link';
import { useMemo } from 'react';

const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const { onSubmit, isLoading } = useRecoverySubmit();

  const schema = useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('v2.form.validation.email')).required(t('v2.form.validation.required')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.recovery.title')}</h1>
      <div className="rounded-box flex flex-col">
        <TextInput
          required
          disabled={isLoading}
          label={t('v2.form.email.label')}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-text-secondary mx-2">
            {t('v2.ui.button.cancel')}
          </Link>
          <Button type="submit" disabled={isLoading}>
            {t('v2.ui.button.confirm')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RecoveryPasswordView;
