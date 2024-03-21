import { AccountCircle } from '@mui/icons-material';
import { Box, Drawer, Stack, TextField } from '@mui/material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppButton from '../AppButton';
import { databaseRequest } from '@/utils/requests';
import { useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { useRef } from 'react';

interface NewCommentProps {
  closeMethod: () => void;
  isOpen: boolean;
}

const schema = yup
  .object({
    content: yup.string().required(),
  })
  .required();

export const NewComment = ({ closeMethod, isOpen }: NewCommentProps) => {
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const inputRef = useRef<HTMLInputElement>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: Object) =>
    await databaseRequest('model', {
      model: 'Comment',
      method: 'addComment',
      arguments: {
        ...formData,
        idea_id: String(params['idea_id']),
        user_id: jwt_payload.user_id,
      },
    }).then(closeMethod);

    const inputFocus = () => { if(isOpen) inputRef.current?.focus() }


  return (
    <Drawer anchor="bottom" open={isOpen} onClose={closeMethod} onTransitionEnd={inputFocus}>
      <FormContainer>
        <Stack p={2} pb={0}>
          <Stack direction="row">
            <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
            <AppButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
              Submit
            </AppButton>
          </Stack>
          <Stack position="relative" mt={1}>
            <TextField
              required
              multiline
              variant="filled"
              minRows={6}
              {...register('content')}
              error={errors.content ? true : false}
              helperText={errors.content?.message || ' '}
              inputRef={inputRef}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '25px',
                border: `8px solid ${grey[200]}`,
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                transformOrigin: 'bottom left',
                transform: 'translateY(-100%)',
              }}
            />
          </Stack>
        </Stack>
      </FormContainer>
    </Drawer>
  );
};

export default NewComment;
