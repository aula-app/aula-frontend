import { AccountCircle } from '@mui/icons-material';
import { localStorageGet } from '@/utils/localStorage';
import { Box, Stack } from '@mui/material';
import { parseJwt } from '@/utils/jwt';
import { SyntheticEvent, useCallback } from 'react';
import { SHARED_CONTROL_PROPS, useAppForm } from '@/utils';
import AppButton from '../AppButton';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useParams } from 'react-router-dom';

interface NewIdeaProps {
  closeMethod: () => void;
}

const VALIDATE_FORM_ADD_IDEA = {
  content: {
    presence: true
  },
};

const IDEA_INITIAL_VALUES = {
  content: '',
} as FormStateValues;

interface FormStateValues {
  content: string;
}

export const NewWildIdea = ({ closeMethod }: NewIdeaProps) => {
  const params = useParams()
  const jwt_token = localStorageGet('token');
  const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;

  const [formState, , , fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_ADD_IDEA,
    initialValues: IDEA_INITIAL_VALUES as FormStateValues,
  });
  const values = formState.values as FormStateValues;

  const formContext = useForm<FormStateValues>({
    defaultValues: IDEA_INITIAL_VALUES,
  });

  const submitNewIdea = useCallback(async (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = formContext.getValues();

    if (!jwt_payload) return ``;

    try {
      const data = await (
        await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/add_idea.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
          body: JSON.stringify({
            content: formValues['content'],
            room_id: params.room_id,
            user_id: jwt_payload.user_id,
          }),
        })
      ).json();

      const result = data.success; // await api.auth.loginWithEmail(values);

      if (result && result === true) {
        closeMethod()
      } else {
        console.log('error');
        return;
      }
    } catch (e) {
      return e;
    }
  }, []);

  return (
    <FormContainer formContext={formContext}>
      <Stack p={2} pb={0}>
        <Stack direction="row">
          <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
          <AppButton type="submit" variant="contained" onClick={submitNewIdea} disabled={!formContext.formState.isValid}>
            Submit
          </AppButton>
        </Stack>
        <Stack position="relative">
          <TextFieldElement
            required
            multiline
            minRows={6}
            name="content"
            value={values.content}
            placeholder="What is your idea?"
            error={fieldHasError('content')}
            helperText={fieldGetError('content') || ' '}
            {...SHARED_CONTROL_PROPS}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '25px',
              border: `8px solid rgba(0, 0, 0, 0.23)`,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              transformOrigin: 'bottom left',
            }}
          />
        </Stack>
      </Stack>
    </FormContainer>
  );
};

export default NewWildIdea;
