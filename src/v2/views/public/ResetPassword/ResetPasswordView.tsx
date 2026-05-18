import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton/IconButton';
import TextInput from '@/v2/components/input/TextInput';
import Icon from '@/components/new/Icon/Icon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useResetPasswordSubmit } from './useResetPasswordSubmit';
import Hint from '@/v2/components/ui/Hint';

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
          .required(t('forms.validation.required'))
          .min(4, t('forms.validation.minLength', { var: 4 }))
          .max(MAX_PASSWORD_LENGTH, t('forms.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        newPassword: yup
          .string()
          .required(t('forms.validation.required'))
          .min(MIN_PASSWORD_LENGTH, t('forms.validation.minLength', { var: MIN_PASSWORD_LENGTH }))
          .max(MAX_PASSWORD_LENGTH, t('forms.validation.maxLength', { var: MAX_PASSWORD_LENGTH })),
        confirmPassword: yup
          .string()
          .required(t('forms.validation.required'))
          .oneOf([yup.ref('newPassword')], t('forms.validation.passwordMatch')),
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

  const watchedNewPassword = useWatch({ control, name: 'newPassword', defaultValue: '' });

  const requirements = [
    {
      key: 'length',
      text: t('forms.validation.passwordMinLength', { count: MIN_PASSWORD_LENGTH }),
      met: (watchedNewPassword || '').length >= MIN_PASSWORD_LENGTH,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate method="POST" className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('auth.password.change')}</h1>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error px-3 py-2 text-sm text-error"
        >
          <span className="flex-1">{error}</span>
          <IconButton onClick={() => setError('')} aria-label={t('actions.close')} className="text-error">
            <Icon type="close" size="1.25em" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-wrap">
        <div className="flex-1 min-w-[min(100%,200px)]">
          <TextInput
            type="password"
            label={t('auth.password.oldPassword')}
            required
            autoComplete="current-password"
            error={errors.oldPassword?.message}
            helperText={t('auth.password.guidelines.tempPassword')}
            data-testid="oldPassword-input"
            {...register('oldPassword')}
          />
        </div>

        <div className="flex-1 min-w-[min(100%,200px)]">
          <TextInput
            type="password"
            label={t('auth.password.newPassword')}
            required
            autoComplete="new-password"
            error={errors.newPassword?.message}
            helperText={
              <span className="flex gap-1">
                <Hint content={t('auth.password.guidelines.hint')} />
                {t('auth.password.guidelines.minLength', { var: MIN_PASSWORD_LENGTH })}
              </span>
            }
            data-testid="newPassword-input"
            {...register('newPassword')}
          />
        </div>

        <div className="flex-1 min-w-[min(100%,200px)]">
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
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" outlined onClick={() => reset()} aria-label={t('actions.cancel')} color="secondary">
          {t('actions.cancel')}
        </Button>
        <Button type="submit" data-testid="submit-new-password" aria-label={t('actions.save')}>
          {t('actions.save')}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordView;
