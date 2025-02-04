import { PossibleFields } from '@/types/Scopes';
import { SelectOptionsType } from '@/utils/Data/formDefaults';
import { FormControl, FormHelperText, MenuItem, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props {
  name: keyof PossibleFields;
  options: SelectOptionsType[];
  control: Control<any, any>;
  disabled?: boolean;
  defaultValue?: string | number;
  onChange?: (...event: any[]) => void;
}

/**
 * Renders "SelectField" component
 */

const SelectField: React.FC<Props> = ({ name, options, control, defaultValue, disabled = false, ...restOfProps }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={control._defaultValues[name] || defaultValue}
      render={({ field, fieldState }) => (
        <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)' }}>
          <TextField
            label={t(`settings.columns.${name}`)}
            required
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
