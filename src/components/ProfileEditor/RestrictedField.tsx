import { AppIconButton } from '@/components';
import { PossibleFields } from '@/types/Scopes';
import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  className?: string;
  placeholder?: string;
  tabIndex?: number;
  /** When true the field is permanently read-only: no unlock toggle. */
  locked?: boolean;
  /** Shows the required asterisk; validation itself lives in the parent schema. */
  required?: boolean;
}

/** * Renders "requests" view
 * url: /settings/requests
 */
const autocompleteTokens: Partial<Record<keyof PossibleFields, string>> = {
  displayname: 'nickname',
  username: 'username',
  realname: 'name',
  email: 'email',
};

const RestrictedField = <T extends FieldValues = FieldValues>({
  name,
  control,
  locked = false,
  required = false,
  ...restOfProps
}: Props<T>) => {
  const { t } = useTranslation();

  const [disabled, setDisabled] = useState(true);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          required={required}
          label={t(`settings.columns.${name}`)}
          id={`profile-${name}`}
          size="small"
          {...field}
          value={field.value ?? ''}
          disabled={locked || disabled}
          error={!!fieldState.error}
          helperText={typeof fieldState.error?.message === 'string' ? fieldState.error.message : undefined}
          slotProps={{
            htmlInput: {
              autoComplete: autocompleteTokens[name as keyof PossibleFields],
            },
            input: {
              'aria-labelledby': `profile-${name}-label`,
              'aria-invalid': !!fieldState.error,
              endAdornment: locked ? undefined : (
                <InputAdornment position="end">
                  <AppIconButton
                    size="small"
                    icon={disabled ? 'lockOpen' : 'lockClosed'}
                    title={t(`actions.${disabled ? 'edit' : 'lock'}`)}
                    aria-label={disabled ? t('actions.edit') : t('actions.lock')}
                    aria-pressed={!disabled}
                    sx={{ mr: -1.5 }}
                    onClick={() => setDisabled(!disabled)}
                  />
                </InputAdornment>
              ),
            },
            inputLabel: {
              id: `profile-${name}-label`,
              htmlFor: `profile-${name}`,
            },
          }}
          {...restOfProps}
        />
      )}
    />
  );
};

export default RestrictedField;
