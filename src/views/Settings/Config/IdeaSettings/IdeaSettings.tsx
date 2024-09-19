import { AppButton, AppIconButton } from '@/components';
import { ObjectPropByName } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
  onReload: () => void | Promise<void>;
}

/** * Renders "IdeaSettings" component
 */
interface CustomFieldsType {
  custom_field1_name: string | null;
  custom_field2_name: string | null;
}

const IdeaSettings = ({ onReload }: Props) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<CustomFieldsType>();

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        custom_field1_name: yup.string().max(50, 'validation.max'),
        custom_field2_name: yup.string().max(50, 'validation.max'),
      })
    ),
  });

  async function getFields() {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (response.success) setFields(response.data);
    });
  }

  async function addFields(fieldValues: ObjectPropByName) {
    await databaseRequest(
      {
        model: 'Settings',
        method: 'setCustomFields',
        arguments: fieldValues,
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) onReload();
    });
  }

  const setFieldValues = () => {
    if (!fields) return;
    if (fields.custom_field1_name) setValue('custom_field1_name', fields.custom_field1_name);
    if (fields.custom_field2_name) setValue('custom_field2_name', fields.custom_field2_name);
  };

  useEffect(() => {
    setFieldValues();
  }, [fields]);

  useEffect(() => {
    getFields();
  }, []);

  return (
    <Stack gap={2}>
      <Typography variant="h6">{t(`settings.customFields`)}</Typography>
      <TextField
        label={t(`settings.customField`, { var: 1 })}
        {...register('custom_field1_name')}
        error={errors.custom_field1_name ? true : false}
        helperText={errors.custom_field1_name?.message || ' '}
        sx={{ mt: 0 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon="delete"
                  title={t('generics.delete')}
                  onClick={() => setValue('custom_field1_name', '')}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        label={t(`settings.customField`, { var: 2 })}
        {...register('custom_field2_name')}
        error={errors.custom_field2_name ? true : false}
        helperText={errors.custom_field2_name?.message || ' '}
        sx={{ mt: 0 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <AppIconButton
                  aria-label="toggle password visibility"
                  icon="delete"
                  title={t('generics.delete')}
                  onClick={() => setValue('custom_field2_name', '')}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </InputAdornment>
            ),
          },
        }}
      />
      <AppButton type="submit" color="primary" sx={{ ml: 'auto', mr: 0 }} onClick={handleSubmit(addFields)}>
        {t('generics.save')}
      </AppButton>
    </Stack>
  );
};

export default IdeaSettings;
