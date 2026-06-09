import Icon from '@/components/new/Icon/Icon';
import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton/IconButton';
import TextInput from '@/v2/components/input/TextInput';
import Link from '@/v2/components/navigation/Link';
import Hint from '@/v2/components/ui/Hint';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useResetPasswordSubmit } from './useResetPasswordSubmit';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 64;

const ResetPasswordView = () => {
  const { t } = useTranslation();
  const { onSubmit, error, setError } = useResetPasswordSubmit();

  const schema = useMemo(
    () =>
      yup.object({
        oldPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(4, t('v2.form.validation.minLength', { var: 4 }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        newPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('v2.form.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('v2.form.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        confirmPassword: yup
          .string()
          .required(t('v2.form.validation.required'))
          .oneOf([yup.ref('newPassword')], t('v2.form.validation.passwordMatch')),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate method="POST" className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">{t('v2.page.passwordReset.title')}</h1>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error-text px-3 py-2 text-sm text-error-text"
        >
          <span className="flex-1">{error}</span>
          <IconButton onClick={() => setError('')} aria-label={t('v2.ui.button.close')} className="text-error-text">
            <Icon type="close" size="1.25em" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col">
        <TextInput
          type="password"
          label={t('v2.form.passwordTemporary.label')}
          required
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          helperText={t('v2.form.passwordTemporary.helper')}
          data-testid="oldPassword-input"
          {...register('oldPassword')}
        />

        <TextInput
          type="password"
          label={t('auth.password.newPassword')}
          required
          autoComplete="new-password"
          error={errors.newPassword?.message}
          helperText={
            <span className="flex gap-1">
              <Hint content={t('v2.form.passwordNew.hint')} />
              {t('v2.form.passwordNew.helper', { var: MIN_PASSWORD_LENGTH })}
            </span>
          }
          data-testid="newPassword-input"
          {...register('newPassword')}
        />

        <TextInput
          type="password"
          label={t('auth.password.confirmPassword')}
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          data-testid="confirmPassword-input"
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" outlined onClick={() => reset()} color="secondary">
          {t('v2.ui.button.clear')}
        </Button>
        <Button type="submit" data-testid="submit-set-password">
          {t('v2.ui.button.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordView;
