import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useForm } from 'react-hook-form';
import { FormContainer } from 'react-hook-form-mui';
import { AccountCircle } from '@mui/icons-material';
import { databaseRequest } from '@/utils/requests';
import { SingleUserResponseType } from '@/types/UserTypes';
import { useEffect, useState } from 'react';
import { ObjectPropByName } from '@/types/Generics';
import { userSettings, UserSettingsKeys } from '@/utils/settings';

const { forms, options } = userSettings;
const schema = yup.object(forms).required();

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

  const request = async (method: string, args: ObjectPropByName) =>
    await databaseRequest('model', {
      model: 'User',
      method: method,
      arguments: args,
      decrypt: ['about_me', 'displayname', 'email', 'realname', 'username'],
    });

  const dataFetch = async () =>
    await request('getUserBaseData', { user_id: params.setting_id }).then((response: SingleUserResponseType) => {
      setItems(response);
    });

  const onSubmit = async (formData: Object) =>
    await request(params.setting_id === 'new' ? 'addUser' : 'editUserData', {
      ...formData,
      user_id: params.setting_id === 'new' ? undefined : params.setting_id,
    }).then((response: SingleUserResponseType) => {
      if (!response.success) return;
      navigate(`/settings/${params.setting_name}`);
    });

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
      {(items.data || params.setting_id === 'new') &&
      <FormContainer>
        {Object.entries(options).map(([key, option]) => {
          const field = key as UserSettingsKeys;
          return (
            <TextField
              required={option.required}
              multiline={option.isText}
              minRows={option.isText ? 4 : 1}
              label={option.label}
              {...register(field)}
              error={errors[field] ? true : false}
              helperText={errors[field]?.message || ' '}
              defaultValue={items.data ? items.data[field] : option.defaultValue}
              sx={option.hidden ? { display: 'none' } : { width: '100%' }}
            />
          );
        })}
        <Stack direction="row">
          <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={() => navigate(`/settings/${params.setting_name}`)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </Stack>
      </FormContainer>
      }
    </Stack>
  );
};

export default UsersView;
