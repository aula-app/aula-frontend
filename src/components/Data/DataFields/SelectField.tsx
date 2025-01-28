import { SelectOptionsType } from '@/utils/Data/formDefaults';
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material';
import { SelectInputProps } from '@mui/material/Select/SelectInput';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props extends SelectInputProps {
  label: string;
  options: SelectOptionsType[];
  control: Control<any, any>;
  defaultValue?: string | number;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "SelectInput" component
 */

const SelectField = ({ label, options, control, defaultValue, disabled = false, ...restOfProps }: Props) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={label}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormControl fullWidth>
          <TextField
            label={t(`settings.columns.${label}`)}
            required
            fullWidth
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
          <FormHelperText error={!!fieldState.error}>{t(fieldState.error?.message || ' ')}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
