import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import InstanceCodeField from '@/v2/components/input/InstanceCodeField';
import { useInstanceCode } from '@/v2/components/input/InstanceCodeField/useInstanceCode';
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
  const {
    instanceCode,
    setInstanceCode,
    isEditing,
    startEditing,
    error: codeError,
    isLoading: codeLoading,
    validateCode,
    showField,
  } = useInstanceCode();

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().required(t('v2.form.validation.required')),
        password: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>({
    resolver: yupResolver(schema),
  });

  const wrappedSubmit = async (data: { username: string; password: string }) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.login.title', { var: 'Aula' })}</h1>

      <div className="rounded-box flex flex-col">
        {showField && (
          <InstanceCodeField
            value={instanceCode}
            onChange={setInstanceCode}
            error={codeError}
            isEditing={isEditing}
            onEditClick={startEditing}
            onConfirmClick={() => {
              validateCode();
            }}
            disabled={isLoading || codeLoading}
          />
        )}
        <TextInput
          label={t('v2.form.login.label')}
          required
          autoComplete="username"
          autoCapitalize="none"
          error={errors.username?.message}
          {...register('username')}
        />
        <TextInput
          label={t('v2.form.password.label')}
          type="password"
          required
          autoComplete="current-password"
          autoCapitalize="none"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={isLoading || codeLoading} data-testid="submit-login">
          {t('v2.page.login.button')}
        </Button>
        <Link to="/recovery" className="ml-auto px-2 text-sm text-text-secondary mt-4">
          {t('v2.page.recovery.link')}
        </Link>
      </div>
    </form>
  );
};

export default LoginView;
