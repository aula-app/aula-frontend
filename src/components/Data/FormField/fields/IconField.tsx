import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { InputSettings } from '@/utils/Data/formDefaults';
import { FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  data: InputSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  setValue: UseFormSetValue<{}>;
};

/**
 * Renders "SelectInput" component
 */

const IconField = ({ data, control, disabled = false, setValue, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const onSubmit = (field: string, image: string) => {
    // @ts-ignore
    setValue(field, image);
  };
  const icons = Object.keys(CAT_ICONS) as Array<keyof typeof CAT_ICONS>;
  return (
    <Controller
      // @ts-ignore
      name={data.name}
      control={control}
      // @ts-ignore
      defaultValue={data.form.defaultValue}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <Typography variant="caption" pl={2}>
            {t('generics.image')}
          </Typography>
          <TextField {...field} {...restOfProps} sx={{ visibility: 'hidden', height: 0 }} />
          <Stack direction="row" flexWrap="wrap" justifyContent="center">
            {icons.map((icon) => (
              <AppIconButton
                key={icon}
                icon={icon}
                onClick={() => onSubmit(field.name, icon)}
                sx={{ border: field.value === icon ? 1 : 0 }}
              />
            ))}
          </Stack>
          <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default IconField;
