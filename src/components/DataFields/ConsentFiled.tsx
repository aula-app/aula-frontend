import { FormControl, Stack, StandardTextFieldProps, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import SelectField from './SelectField';

interface Props extends StandardTextFieldProps {
  control: Control<any, any>;
}

/**
 * Renders "ConsentField" component
 */

const ConsentField: React.FC<Props> = ({ control, sx }) => {
  const { t } = useTranslation();

  const CONSENT_OPTIONS = [
    // { label: t('consent.message'), value: 0 },
    { label: t('consent.announcement'), value: 1 },
    { label: t('consent.alert'), value: 2 },
  ];

  return (
    <Controller
      name="user_needs_to_consent"
      control={control}
      render={({ field }) => (
        <FormControl sx={{ flex: 1, minWidth: 'min(150px, 100%)', ...sx }}>
          <Stack direction="row" gap={2}>
            <SelectField
              name="user_needs_to_consent"
              control={control}
              options={CONSENT_OPTIONS}
              defaultValue={1}
              required
              sx={{ minWidth: 200, flex: 0 }}
            />
            {field.value > 0 && (
              <Controller
                name="consent_text"
                control={control}
                defaultValue={t('actions.agree')}
                render={({ field, fieldState }) => (
                  <TextField
                    label={t('settings.columns.consent_text')}
                    error={!!fieldState.error}
                    helperText={`${fieldState.error?.message || ''}`}
                    required
                    sx={{ flex: 1 }}
                    {...field}
                  />
                )}
              />
            )}
          </Stack>
        </FormControl>
      )}
    />
  );
};

export default ConsentField;
