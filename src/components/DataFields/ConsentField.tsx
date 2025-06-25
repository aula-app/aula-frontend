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
              control={control}
              options={CONSENT_OPTIONS}
              defaultValue={1}
              required
              sx={{ minWidth: 200, flex: 0 }}
              {...field}
            />
            <Controller
              name="consent_text"
              control={control}
              defaultValue={control._defaultValues.consent_text}
              render={({ field, fieldState }) => (
                <TextField
                  label={t('settings.columns.consent_text')}
                  id="consent-text-field"
                  error={!!fieldState.error}
                  helperText={<span id="consent-text-error-message">{fieldState.error?.message || ''}</span>}
                  required
                  sx={{ flex: 1 }}
                  inputProps={{
                    'aria-labelledby': 'consent-text-field-label',
                    'aria-invalid': !!fieldState.error,
                    'aria-errormessage': fieldState.error ? 'consent-text-error-message' : undefined
                  }}
                  InputLabelProps={{
                    id: 'consent-text-field-label',
                    htmlFor: 'consent-text-field'
                  }}
                  {...field}
                />
              )}
            />
          </Stack>
        </FormControl>
      )}
    />
  );
};

export default ConsentField;
