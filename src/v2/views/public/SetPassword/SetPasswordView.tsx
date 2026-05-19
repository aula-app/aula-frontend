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
      <h2 className="text-2xl font-semibold">{t('v2.page.passwordSet.title')}</h2>

      {!isValid && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-error px-3 py-2 text-sm text-error"
        >
          <Hint content={t('v2.page.passwordSet.hint')} />
          <span className="flex-1">{t('v2.page.passwordSet.error')}</span>
          <IconButton aria-label={t('v2.ui.button.close')} hint={t('v2.ui.button.close')} onClick={() => setValid(true)} className="text-error" dense>
            <Icon type="close" />
          </IconButton>
        </div>
      )}

      <div className="flex flex-col">
        <TextInput
          type="password"
          label={t('v2.form.passwordNew.label')}
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
          label={t('v2.form.passwordConfirm.label')}
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
        <Button type="button" outlined onClick={() => reset()} color="secondary">
          {t('v2.ui.button.clear')}
        </Button>
        <Button type="submit">{t('v2.ui.button.confirm')}</Button>
      </div>
    </form>
  );
};

export default SetPasswordView;
