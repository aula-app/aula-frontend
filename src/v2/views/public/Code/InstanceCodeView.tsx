import TextInput from '@/v2/components/input/TextInput';
import { useCodeSubmit } from './useCodeSubmit';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Button from '@/v2/components/button/Button';

const MIN_CODE_LENGTH = 3;
const MAX_CODE_LENGTH = 8;

const InstanceCodeView = () => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object({
        instanceCode: yup
          .string()
          .required(t('forms.validation.required'))
          .min(MIN_CODE_LENGTH, t('forms.validation.minLength', { var: MIN_CODE_LENGTH }))
          .max(MAX_CODE_LENGTH, t('forms.validation.maxLength', { var: MAX_CODE_LENGTH })),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<{ instanceCode: string }>({
    resolver: yupResolver(schema),
  });

  const { onSubmit, isLoading } = useCodeSubmit(setFormError);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('auth.messages.welcome')}</h1>

      <fieldset className="flex flex-col">
        <TextInput
          label={t('instance.label')}
          required
          autoComplete="username"
          autoCapitalize="none"
          error={errors.instanceCode?.message}
          helperText={t('instance.headline')}
          {...register('instanceCode')}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} aria-label={t('auth.login.button')}>
          {t('auth.login.button')}
        </Button>
      </fieldset>
    </form>
  );
};

export default InstanceCodeView;
