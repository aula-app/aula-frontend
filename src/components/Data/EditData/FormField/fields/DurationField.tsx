import { InputSettings } from '@/utils/Data/formDefaults';
import { FormHelperText, FormLabel, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  control: Control<{}, any>;
  data: InputSettings;
  disabled?: boolean;
  setValue: UseFormSetValue<{}>;
  getValues: () => void;
};

/**
 * Renders "SelectInput" component
 */

const DurationField = ({ data, control, disabled = false, setValue, getValues, ...restOfProps }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      flexWrap="wrap"
      {...restOfProps}
      gap={2}
    >
      <FormLabel sx={{ mr: 3, pb: 3 }}>{t(`texts.phaseDuration`)}:</FormLabel>
      {Array.isArray(data.name) ? (
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
                  <Typography noWrap>{t(`settings.${name}`)}:</Typography>
                  <TextField
                    required={data.required}
                    disabled={disabled}
                    type="number"
                    variant="standard"
                    {...field}
                    sx={{ width: 80 }}
                    {...restOfProps}
                    slotProps={{ inputLabel: { shrink: !!field.value } }}
                  />
                  <Typography noWrap>{t('generics.days')}</Typography>
                </Stack>
                <FormHelperText error={!!fieldState.error} sx={{ mx: 'auto' }}>
                  {t(fieldState.error?.message || ' ')}
                </FormHelperText>
              </Stack>
            )}
          />
        ))
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default DurationField;
