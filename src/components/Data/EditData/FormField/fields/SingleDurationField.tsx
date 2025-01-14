import { InputSettings } from '@/utils/Data/formDefaults';
import { FormLabel, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  data: InputSettings;
  disabled?: boolean;
  control: Control<{}, any>;
  setValue: UseFormSetValue<{}>;
};

/**
 * Renders "SelectInput" component
 */

const SingleDurationField = ({ data, control, disabled = false, setValue, ...restOfProps }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" px={1} flexWrap="wrap" {...restOfProps}>
      <FormLabel sx={{ mr: 3, pb: 1 }}>{t('settings.time.phase')}:</FormLabel>
      <Controller
        // @ts-ignore
        name={'phase_duration_3'}
        control={control}
        // @ts-ignore
        defaultValue={data.form.defaultValue}
        render={({ field, fieldState }) => (
          <Stack direction="row" alignItems="center">
            <Typography noWrap pb={1}>
              {t(`settings.columns.phase_duration_3`)}:
            </Typography>
            <TextField
              required={data.required}
              disabled={disabled}
              type="number"
              variant="standard"
              {...field}
              // @ts-ignore
              error={!!fieldState.error}
              // @ts-ignore
              helperText={t(fieldState.error?.message || ' ')}
              sx={{ mx: 2, mt: 2, width: 80 }}
              {...restOfProps}
              slotProps={{ inputLabel: { shrink: !!field.value } }}
            />
          </Stack>
        )}
      />
    </Stack>
  );
};

export default SingleDurationField;
