import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/v2/components/button/Button';
import TextInput from '@/v2/components/input/TextInput';
import InstanceCodeField from '@/v2/components/input/InstanceCodeField/InstanceCodeField';
import { useInstanceCode } from '@/v2/components/input/InstanceCodeField/useInstanceCode';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useRecoverySubmit } from './useRecoverySubmit';
import Link from '@/v2/components/navigation/Link';
import { useMemo } from 'react';

const RecoveryPasswordView = () => {
  const { t } = useTranslation();
  const { onSubmit, isLoading } = useRecoverySubmit();
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
        email: yup.string().email(t('v2.form.validation.email')).required(t('v2.form.validation.required')),
      }),
    [t]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const wrappedSubmit = async (data: { email: string }) => {
    const codeOk = await validateCode();
    if (!codeOk) return;
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(wrappedSubmit)} noValidate className="flex-1 flex flex-col gap-4">
      <h1>{t('v2.page.recovery.title')}</h1>
      <div className="rounded-box flex flex-col gap-2">
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
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              disabled={isLoading}
              label={t('v2.form.email.label')}
              type="email"
              autoComplete="email"
              error={errors.email?.message}
            />
          )}
        />
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isLoading || codeLoading}>
            {t('v2.ui.button.confirm')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RecoveryPasswordView;
