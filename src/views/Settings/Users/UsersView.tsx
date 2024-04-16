import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { FormContainer } from 'react-hook-form-mui';
import { AccountCircle } from '@mui/icons-material';
import { databaseRequest } from '@/utils/requests';
import { SingleUserResponseType, UsersResponseType } from '@/types/UserTypes';
import { useEffect, useState } from 'react';

const schema = yup
  .object({
    realname: yup.string().required(),
    displayname: yup.string().required(),
    email: yup.string().email().required(),
  })
  .required();

/** * Renders "Users" view
 * url: /settings/users/:id
 */
const UsersView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState({} as SingleUserResponseType);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dataFetch = async () =>
    await databaseRequest('model', {
      model: 'User',
      method: 'getUserBaseData',
      arguments: {
        user_id: params.setting_id,
      },
      decrypt: ['realname', 'diaplayname', 'email'],
    }).then((response: SingleUserResponseType) => {
      setItems(response);
    });

  const onSubmit = (formData: Object) => console.log(formData);

  useEffect(() => {
    if (params.setting_id !== 'new') dataFetch();
  }, []);

  return (
    <Stack p={2}>
      <Stack direction="row" justifyContent="space-between">
        <Avatar>
          <AccountCircle sx={{ fontSize: '3em', mr: 'auto' }} />
        </Avatar>
        <Typography variant="h4" pb={2}>
          {params.setting_id === 'new' ? 'New' : 'Edit'} User
        </Typography>
      </Stack>
      <FormContainer>
        <TextField
          required
          label="Student Name"
          {...register('realname')}
          error={errors.realname ? true : false}
          helperText={errors.realname?.message || ' '}
          value={items.data?.realname || ''}
          sx={{ width: '100%' }}
        />
        <TextField
          required
          label="Display Name"
          {...register('displayname')}
          error={errors.displayname ? true : false}
          helperText={errors.displayname?.message || ' '}
          value={items.data?.displayname || ''}
          sx={{ width: '100%' }}
        />
        <TextField
          required
          label="Email"
          {...register('email')}
          error={errors.email ? true : false}
          helperText={errors.email?.message || ' '}
          value={items.data?.email || ''}
          sx={{ width: '100%' }}
        />
        <Stack direction="row">
          <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={() => navigate(`/settings/${params.setting_name}`)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </Stack>
      </FormContainer>
    </Stack>
  );
};

export default UsersView;
