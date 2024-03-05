import { AccountCircle } from '@mui/icons-material';
import { Box, Stack } from '@mui/material';
import { useCallback } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AppButton from '../AppButton';
import { databaseRequest } from '@/utils/requests';
import { useParams } from 'react-router-dom';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: Object) => {
    const request = await databaseRequest('add_idea', {...formData, ...params})

    if(!request) {
      console.log('erro');
      return;
    }

    closeMethod();
  }

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
