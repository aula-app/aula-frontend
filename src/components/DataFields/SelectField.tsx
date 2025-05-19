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
            id={`select-field-${name}`}
            required={required}
            disabled={disabled}
            select
            {...field}
            error={!!fieldState.error}
            helperText={t(`${fieldState.error?.message || ''}`)}
            {...restOfProps}
            slotProps={{
              htmlInput: {
                'aria-labelledby': `select-field-${name}-label`,
              },
              inputLabel: { shrink: true, id: `select-field-${name}-label`, htmlFor: `select-field-${name}` },
            }}
          >
            {options.map((option) => (
              <MenuItem value={option.value} key={option.value} disabled={option.disabled ? option.disabled : false}>
                {t(option.label)}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
