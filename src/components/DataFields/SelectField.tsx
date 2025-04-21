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
      render={({ field, fieldState }) => {
        // Generate unique IDs for accessibility
        const inputId = `select-${name}`;
        const helperId = `helper-text-${name}`;
        const errorId = fieldState.error ? `error-${name}` : undefined;

        return (
          <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)', ...sx }}>
            <TextField
              id={inputId}
              label={t(`settings.columns.${name}`)}
              required={required}
              disabled={disabled}
              select
              {...field}
              error={!!fieldState.error}
              helperText={t(`${fieldState.error?.message || ''}`)}
              {...restOfProps}
              slotProps={{ 
                inputLabel: { shrink: true },
                input: { 
                  'aria-required': required,
                  'aria-invalid': !!fieldState.error,
                  'aria-describedby': fieldState.error ? `${helperId} ${errorId}` : helperId
                }
              }}
              FormHelperTextProps={{
                id: fieldState.error ? errorId : helperId,
                role: fieldState.error ? 'alert' : undefined
              }}
            >
              {options.map((option) => (
                <MenuItem 
                  value={option.value} 
                  key={option.value} 
                  disabled={(option.disabled) ? option.disabled : false}
                  aria-disabled={(option.disabled) ? option.disabled : false}
                >
                  {t(option.label)}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        );
      }}
    />
  );
};

export default SelectField;
