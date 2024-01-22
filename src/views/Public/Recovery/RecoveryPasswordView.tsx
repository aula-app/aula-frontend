import { SyntheticEvent, useCallback, useState } from 'react';
import { TextField, Typography, Stack } from '@mui/material';
import { AppButton, AppAlert, AppForm } from '@/components';
import { useAppForm, SHARED_CONTROL_PROPS } from '@/utils/form';

const VALIDATE_FORM_RECOVERY_PASSWORD = {
  email: {
    presence: true,
    email: true,
  },
};

interface FormStateValues {
  email: string;
}

interface Props {
  email?: string;
}

/**
 * Renders "Recover Password" view for Login flow
 * url: /recovery/password
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const RecoveryPasswordView = ({ email = '' }: Props) => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email } as FormStateValues,
  });
  const [message, setMessage] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    // await api.auth.recoverPassword(values);

    //Show message with instructions for the user
    setMessage('Email with instructions has been sent to your address');
  };

  const handleCloseError = useCallback(() => setMessage(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Stack>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Password Recovery
        </Typography>
        <TextField
          required
          label="Email"
          name="email"
          value={values.email}
          error={fieldHasError('email')}
          helperText={fieldGetError('email') || ' '}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
        />

        {message ? (
          <AppAlert severity="success" onClose={handleCloseError}>
            {message}
          </AppAlert>
        ) : null}

        <AppButton type="submit" disabled={!formState.isValid} sx={{ mx: 0 }}>
          Recover
        </AppButton>
      </Stack>
    </AppForm>
  );
};

export default RecoveryPasswordView;
