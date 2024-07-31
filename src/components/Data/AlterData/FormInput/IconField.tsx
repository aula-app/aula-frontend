import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { formsSettings } from '@/utils';
import { FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, UseFormSetValue } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  form: keyof typeof formsSettings;
  control: Control<{}, any>;
  disabled?: boolean;
  setValue: UseFormSetValue<{}>;
};

/**
 * Renders "SelectInput" component
 */

const IconField = ({ form, control, disabled = false, setValue, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const onSubmit = (field: string, image: string) => {
    // @ts-ignore
    setValue(field, image);
  };
  const icons = Object.keys(CAT_ICONS) as Array<keyof typeof CAT_ICONS>;
  return (
    <Controller
      // @ts-ignore
      name={form}
      control={control}
      // @ts-ignore
      defaultValue={''}
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
