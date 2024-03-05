import { AccountCircle } from '@mui/icons-material';
import { localStorageGet } from '@/utils/localStorage';
import { Box, Stack } from '@mui/material';
import { parseJwt } from '@/utils/jwt';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppButton from '../AppButton';

interface NewIdeaProps {
  closeMethod: () => void;
}

const schema = yup
  .object({
    content: yup.string().required().min(20),
  })
  .required();

const IDEA_INITIAL_VALUES = {
  content: '',
} as FormStateValues;

interface FormStateValues {
  content: string;
}

export const NewWildIdea = ({ closeMethod }: NewIdeaProps) => {
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(async (formData: Object) => {
    console.log(formData);
      if (!jwt_payload) return ``;

      try {
        const request = await (
          await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/add_idea.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + jwt_token,
            },
            body: JSON.stringify({
              room_id: params.room_id,
              user_id: jwt_payload.user_id,
              ...formData,
            }),
          })
        ).json();

        const result = request.success; // await api.auth.loginWithEmail(values);

        if (result && result === true) {
          closeMethod();
        } else {
          console.log('error');
          return;
        }
      } catch (e) {
        return e;
      }
    }, []);

  return (
    <FormContainer>
      <Stack p={2} pb={0}>
        <Stack direction="row">
          <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
          <AppButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </AppButton>
        </Stack>
        <Stack position="relative">
          <TextFieldElement
            required
            multiline
            minRows={6}
            {...register('content')}
            error={'content' in errors}
            helperText={errors.content?.message || ' '}
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
