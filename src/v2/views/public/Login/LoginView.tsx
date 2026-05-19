import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useLoginSubmit } from './useLoginSubmit';

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 64;

const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const { onSubmit, isLoading } = useLoginSubmit();

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('forms.validation.required')),
        password: yup
          .string()
          .required(t('forms.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('forms.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('forms.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('auth.messages.welcome')}</h1>

      <fieldset className="rounded-box flex flex-col">
        <TextInput
          label={t('auth.login.label')}
          required
          autoComplete="username"
          autoCapitalize="none"
          error={errors.username?.message}
          {...register('username')}
        />
        <TextInput
          label={t('auth.password.label')}
          type="password"
          required
          autoComplete="current-password"
          autoCapitalize="none"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={isLoading} aria-label={t('auth.login.button')}>
          {t('auth.login.button')}
        </Button>
        <Link
          to="/recovery"
          className="ml-auto px-2 text-sm text-text-secondary mt-4"
          aria-label={t('auth.forgotPassword.link')}
        >
          {t('auth.forgotPassword.link')}
        </Link>
      </fieldset>
    </form>
  );
};

export default LoginView;
