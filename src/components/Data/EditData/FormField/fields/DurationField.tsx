import { ObjectPropByName } from '@/types/Generics';
import { databaseRequest } from '@/utils';
import { InputSettings } from '@/utils/Data/formDefaults';
import { FormHelperText, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  control: Control<{}, any>;
  data: InputSettings;
  disabled?: boolean;
  setError: UseFormSetError<ObjectPropByName>;
  clearErrors: UseFormClearErrors<ObjectPropByName>;
  setValue: UseFormSetValue<ObjectPropByName>;
  getValues: UseFormGetValues<ObjectPropByName>;
};

/**
 * Renders "SelectInput" component
 */

const DurationField = ({
  data,
  control,
  disabled = false,
  setValue,
  getValues,
  setError,
  clearErrors,
  ...restOfProps
}: Props) => {
  const { t } = useTranslation();
  const [multiError, setMultiError] = useState(false);

  const checkNull = () => {
    if (!Array.isArray(data.name)) return;
    if (getValues(data.name).every((item) => item === '0')) {
      setError('notRegisteredInput', { type: 'custom', message: '' });
      setMultiError(true);
    } else {
      clearErrors('notRegisteredInput');
      setMultiError(false);
    }
  };

  return (
    <Stack>
      <FormHelperText hidden={!multiError} error={multiError} sx={{ mx: 'auto' }}>
        {t('forms.validation.duration')}
      </FormHelperText>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        flexWrap="wrap"
        {...restOfProps}
        gap={2}
      >
        <FormLabel sx={{ mr: 3, pb: 3 }}>{t(`settings.time.phase`)}:</FormLabel>
        {Array.isArray(data.name) &&
          data.name.map((name) => (
            <Controller
              key={name}
              // @ts-ignore
              name={name}
              control={control}
              // @ts-ignore
              defaultValue={data.form.defaultValue}
              render={({ field, fieldState }) => (
                <Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography noWrap>{t(`settings.columns.${name}`)}:</Typography>
                    <TextField
                      required={data.required}
                      disabled={disabled}
                      type="number"
                      variant="standard"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        checkNull();
                      }}
                      sx={{ width: 80 }}
                      {...restOfProps}
                      slotProps={{ inputLabel: { shrink: !!field.value } }}
                    />
                    <Typography noWrap>{t('ui.units.days')}</Typography>
                  </Stack>
                  <FormHelperText error={!!fieldState.error} sx={{ mx: 'auto' }}>
                    {t(fieldState.error?.message || ' ')}
                  </FormHelperText>
                </Stack>
              )}
            />
          ))}
      </Stack>
    </Stack>
  );
};

export default DurationField;
