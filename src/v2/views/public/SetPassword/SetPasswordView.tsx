import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import * as yup from 'yup';
import { useSetPasswordSubmit } from './useSetPasswordSubmit';

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 64;

const SetPasswordView = () => {
  const { t } = useTranslation();
  const { isValid, setValid, error, onSubmit } = useSetPasswordSubmit();

  const schema = useMemo(
    () =>
      yup.object({
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
      <h2 className="text-2xl font-semibold">{t('auth.password.set')}</h2>

      {!isValid && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error px-3 py-2 text-sm text-error"
        >
          <span className="flex-1">{t('errors.invalidCode')}</span>
          <button
            type="button"
            onClick={() => setValid(true)}
            className="text-error hover:opacity-70"
            aria-label={t('actions.close')}
          >
            <HiOutlineXMark size="1.25em" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[min(100%,200px)]">
          <TextInput
            type="password"
            label={t('auth.password.newPassword')}
            required
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <ul className="mt-1 space-y-0.5 px-1">
            {requirements.map((req) => (
              <li
                key={req.key}
                className={`flex items-center gap-1 text-xs ${req.met ? 'text-success' : 'text-text-secondary'}`}
              >
                {req.met ? <HiOutlineCheck size="1.1em" /> : <HiOutlineXMark size="1.1em" />}
                {req.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 min-w-[min(100%,200px)]">
          <TextInput
            type="password"
            label={t('auth.password.confirmPassword')}
            required
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-2">
        {error && (
          <div role="alert" className="rounded-lg border border-error px-3 py-2 text-sm text-error">
            {error}
          </div>
        )}
        <Button
          type="button"
          outlined
          onClick={() => reset()}
          aria-label={t('actions.cancel')}
          className="border-error text-error hover:bg-error/10 active:bg-error/20"
        >
          {t('actions.cancel')}
        </Button>
        <Button type="submit" aria-label={t('actions.save')}>
          {t('actions.save')}
        </Button>
      </div>
    </form>
  );
};

export default SetPasswordView;
