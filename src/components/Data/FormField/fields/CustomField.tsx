import { CustomFieldsType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';
import { InputSettings } from '@/utils/Data/formDefaults';
import { Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  data: InputSettings;
  disabled?: boolean;
  control: Control<{}, any>;
  setValue: UseFormSetValue<{}>;
};

/**
 * Renders "CustomField" component
 */

const CustomField = ({ data, control, disabled = false, setValue, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const [fields, setFields] = useState<CustomFieldsType>({
    custom_field1: null,
    custom_field2: null,
  });

  async function getFields() {
    await databaseRequest({
      model: 'Settings',
      method: 'getCustomfields',
      arguments: {},
    }).then((response) => {
      if (response.success)
        setFields({
          custom_field1: response.data.custom_field1_name,
          custom_field2: response.data.custom_field2_name,
        });
    });
  }

  useEffect(() => {
    getFields();
  }, []);

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" {...restOfProps}>
      {(Object.keys(fields) as Array<keyof CustomFieldsType>).map((customField) => (
        <Controller
          // @ts-ignore
          name={customField}
          control={control}
          // @ts-ignore
          defaultValue={data.form.defaultValue}
          // @ts-ignore
          render={({ field, fieldState }) => (
            <TextField
              label={fields[customField]}
              required={data.required}
              minRows={data.form.type === 'text' ? 4 : 1}
              multiline={data.form.type === 'text'}
              disabled={disabled}
              type={data.form.type}
              fullWidth
              {...field}
              error={!!fieldState.error}
              helperText={t(fieldState.error?.message || ' ')}
              slotProps={{ inputLabel: { shrink: !!field.value } }}
              {...restOfProps}
              sx={{ display: fields[customField] ? 'block' : 'none' }}
            />
          )}
        />
      ))}
    </Stack>
  );
};

export default CustomField;
