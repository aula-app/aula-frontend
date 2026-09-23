import { SelectOptionsType } from '@/types/SettingsTypes';
import { FormControl, MenuItem, TextField } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';

interface Props<T extends FieldValues = FieldValues> extends React.ComponentProps<typeof TextField> {
  name: Path<T>;
  options: SelectOptionsType;
  control: Control<T>;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string | number;
  onChange?: (...event: unknown[]) => void;
}

/**
 * Renders "SelectField" component
 */

const SelectField = <T extends FieldValues = FieldValues>({
  name,
  options,
  control,
  defaultValue,
  disabled = false,
  required = false,
  sx,
  ...restOfProps
}: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={(control._defaultValues as FieldValues)[name] || defaultValue}
      render={({ field, fieldState }) => (
        <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)', ...sx }}>
          <TextField
            label={t(`settings.columns.${name}`)}
            id={`select-field-${name}`}
            data-testid={`select-field-${name}`}
            required={required}
            disabled={disabled}
            select
            {...field}
            error={!!fieldState.error}
            helperText={<span id={`${name}-error-message`}>{t(`${fieldState.error?.message || ''}`)}</span>}
            {...restOfProps}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    'data-testid': `select-field-${name}-list`,
                  } as any,
                },
                'data-testid': `select-field-${name}-value`,
              } as any,
              htmlInput: {
                'aria-labelledby': `select-field-${name}-label`,
                'aria-invalid': !!fieldState.error,
                'aria-errormessage': fieldState.error ? `${name}-error-message` : undefined,
                'data-testid': `select-field-${name}-input`,
              },
              inputLabel: {
                shrink: true,
                id: `select-field-${name}-label`,
                htmlFor: `select-field-${name}`,
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                value={option.value}
                key={option.value}
                disabled={option.disabled ? option.disabled : false}
                data-testid={`select-option-${option.value}`}
              >
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
