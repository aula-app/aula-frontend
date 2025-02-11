import { PossibleFields } from '@/types/Scopes';
import { SelectOptionsType } from '@/types/SettingsTypes';
import { FormControl, FormHelperText, MenuItem, StandardTextFieldProps, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props extends StandardTextFieldProps {
  name: keyof PossibleFields;
  options: SelectOptionsType;
  control: Control<any, any>;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string | number;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "SelectField" component
 */

const SelectField: React.FC<Props> = ({
  name,
  options,
  control,
  defaultValue,
  disabled = false,
  required = false,
  sx,
  ...restOfProps
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={control._defaultValues[name] || defaultValue}
      render={({ field, fieldState }) => (
        <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)', ...sx }}>
          <TextField
            label={t(`settings.columns.${name}`)}
            required={required}
            disabled={disabled}
            select
            {...field}
            error={!!fieldState.error}
            {...restOfProps}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {options.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {t(option.label)}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText error={!!fieldState.error}>{t(`${fieldState.error?.message || ''}`)}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
