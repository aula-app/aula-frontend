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
          size="small"
          {...field}
          disabled={disabled}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    size="small"
                    icon={`lock${disabled ? 'Open' : 'Closed'}`}
                    sx={{ mr: -1.5 }}
                    onClick={() => setDisabled(!disabled)}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default RestrictedField;
