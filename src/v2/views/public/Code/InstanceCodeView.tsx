import TextInput from '@/v2/components/input/TextInput';
import { useCodeSubmit } from './useCodeSubmit';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Button from '@/v2/components/button/Button';
import Link from '@/v2/components/navigation/Link';

const MIN_CODE_LENGTH = 3;
const MAX_CODE_LENGTH = 8;

const InstanceCodeView = () => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      yup.object({
        instanceCode: yup
          .string()
          .required(t('v2.form.validation.required'))
          .min(MIN_CODE_LENGTH, t('v2.form.validation.minLength', { var: MIN_CODE_LENGTH }))
          .max(MAX_CODE_LENGTH, t('v2.form.validation.maxLength', { var: MAX_CODE_LENGTH })),
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
      <h1>{t('v2.page.code.title')}</h1>

      <div className="flex flex-col">
        <TextInput
          label={t('v2.form.code.label')}
          required
          autoCapitalize="none"
          error={errors.instanceCode?.message}
          helperText={t('v2.page.code.hint')}
          data-testid="instance-code"
          {...register('instanceCode')}
          disabled={isLoading}
        />
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isLoading} data-testid="submit-instance-code">
            {t('v2.ui.button.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InstanceCodeView;
