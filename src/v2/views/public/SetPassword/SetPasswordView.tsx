import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import * as yup from 'yup';
import { useSetPasswordSubmit } from './useSetPasswordSubmit';
import Hint from '@/v2/components/ui/Hint';
import Link from '@/v2/components/navigation/Link';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/components/new/Icon';

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate method="POST" className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-semibold">{t('auth.password.set')}</h2>

      {!isValid && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error px-3 py-2 text-sm text-error"
        >
          <Hint content={t('auth.password.guidelines.wrongLink')} />
          <span className="flex-1">{t('errors.invalidCode')}</span>
          <IconButton title={t('actions.close')} onClick={() => setValid(true)} className="text-error" dense>
            <Icon type="close" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col">
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

        <TextInput
          type="password"
          label={t('auth.password.confirmPassword')}
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link to="/" className="text-sm text-error mr-auto">
          {t('actions.cancel')}
        </Link>
        <Button type="button" outlined onClick={() => reset()} aria-label={t('actions.cancel')} color="secondary">
          {t('actions.clear.generic')}
        </Button>
        <Button type="submit" aria-label={t('actions.save')}>
          {t('actions.save')}
        </Button>
      </div>
    </form>
  );
};

export default SetPasswordView;
