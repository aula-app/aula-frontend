import { AppIconButton } from '@/components';
import { PossibleFields } from '@/types/Scopes';
import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  name: keyof PossibleFields;
  control: Control<any, any>;
}

/** * Renders "requests" view
 * url: /settings/requests
 */
const RestrictedField = ({ name, control }: Props) => {
  const { t } = useTranslation();

  const [disabled, setDisabled] = useState(true);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          fullWidth
          label={t(`settings.columns.${name}`)}
          id={`profile-${name}`}
          size="small"
          {...field}
          disabled={disabled}
          slotProps={{
            htmlInput: {
              'aria-labelledby': `profile-${name}-label`,
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    size="small"
                    icon={`lock${disabled ? 'Open' : 'Closed'}`}
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
        />
      )}
    />
  );
};

export default RestrictedField;
