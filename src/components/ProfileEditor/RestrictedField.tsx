import { AppIconButton } from '@/components';
import { PossibleFields } from '@/types/Scopes';
import { InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  name: keyof PossibleFields;
  control: Control<any, any>;
  className?: string;
  placeholder?: string;
  tabIndex?: number;
}

/** * Renders "requests" view
 * url: /settings/requests
 */
const RestrictedField = ({ name, control, ...restOfProps }: Props) => {
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
            input: {
              'aria-labelledby': `profile-${name}-label`,
              endAdornment: (
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
