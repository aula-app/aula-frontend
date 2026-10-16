import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
};

/**
 * Renders "SelectInput" component
 */

const IconField = <T extends FieldValues = FieldValues>({ name, control, ...restOfProps }: Props<T>) => {
  const { t } = useTranslation();
  const icons = Object.keys(CAT_ICONS) as Array<keyof typeof CAT_ICONS>;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={(control._defaultValues as FieldValues)[name]}
      render={({ field, fieldState }) => (
        <FormControl fullWidth data-testid="icon-field-container">
          <Typography variant="caption" pl={2} data-testid="icon-field-label">
            {t('ui.files.image.label')}
          </Typography>
          <TextField {...field} {...restOfProps} sx={{ visibility: 'hidden', height: 0 }} />
          <Stack direction="row" flexWrap="wrap" justifyContent="center" data-testid="icon-field-buttons">
            {icons.map((icon, i) => (
              <AppIconButton
                data-testid={`icon-cat-${i}`}
                data-icon-name={icon}
                data-selected={field.value === icon}
                key={icon}
                icon={icon}
                onClick={() => field.onChange(icon)}
                sx={{
                  bgcolor: field.value === icon ? 'primary.light' : 'transparent',
                }}
              />
            ))}
          </Stack>
          <FormHelperText error={!!fieldState.error} data-testid="icon-field-error">
            {t(fieldState.error?.message || ' ')}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default IconField;
