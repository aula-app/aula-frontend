import { CAT_ICONS } from '@/components/AppIcon/AppIcon';
import AppIconButton from '@/components/AppIconButton';
import { PossibleFields } from '@/types/Scopes';
import { FormControl, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

type Props = {
  name: keyof PossibleFields;
  control: Control<any, any>;
  disabled?: boolean;
};

/**
 * Renders "SelectInput" component
 */

const IconField: React.FC<Props> = ({ name, control, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();
  const icons = Object.keys(CAT_ICONS) as Array<keyof typeof CAT_ICONS>;
  return (
    <Controller
      // @ts-ignore
      name={name}
      control={control}
      // @ts-ignore
      defaultValue={control._defaultValues[name]}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <Typography variant="caption" pl={2}>
            {t('ui.files.image.label')}
          </Typography>
          <TextField {...field} {...restOfProps} sx={{ visibility: 'hidden', height: 0 }} />
          <Stack direction="row" flexWrap="wrap" justifyContent="center">
            {icons.map((icon) => (
              <AppIconButton
                data-testing-id="icon-field-icon"
                key={icon}
                icon={icon}
                onClick={() => field.onChange(icon)}
                sx={{
                  bgcolor: field.value === icon ? 'primary.light' : 'transparent',
                }}
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
