import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Drawer, Stack, TextField, Typography } from '@mui/material';
import { SettingsType } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';
import { SettingsConfig } from '@/utils/Settings';
import { databaseRequest } from '@/utils/requests';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { AccountCircle } from '@mui/icons-material';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/** * Renders "Settings" drawer component view
 * url: /settings/:setting_name/:setting_id
 */
const EditSettings = () => {
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingsType; setting_id: number | 'new' };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object(SettingsConfig[setting_name].forms).required()),
  });

  const [items, setItems] = useState({} as SingleResponseType);

  const request = async (method: string, args: ObjectPropByName) =>
    await databaseRequest('model', {
      model: SettingsConfig[setting_name].requests.model,
      method: method,
      arguments: args,
      decrypt: SettingsConfig[setting_name].requests.decrypt,
    });

  const dataFetch = async () =>
    await request(SettingsConfig[setting_name].requests.get, { [`${setting_name.slice(0, -1)}_id`]: setting_id }).then(
      (response) => setItems(response)
    );

  const onSubmit = async (formData: Object) =>
    await request(
      setting_id === 'new' ? SettingsConfig[setting_name].requests.add : SettingsConfig[setting_name].requests.edit,
      {
        ...formData,
        [`${setting_name.slice(0, -1)}_id`]: setting_id === 'new' ? undefined : setting_id,
      }
    ).then((response) => {
      if (!response.success) return;
      navigate(`/settings/${setting_name}`);
    });

  const updateValues = () => {
    if (!items.data) return;
    Object.entries(SettingsConfig[setting_name].options).forEach(([field, option]) => {
      setValue(field, items.data[field] || option.defaultValue);
    });
  };

  useEffect(() => {
    updateValues();
  }, [items.data]);

  useEffect(() => {
    if (setting_id && setting_id !== 'new') dataFetch();
  }, [setting_id]);

  return (
    <Drawer
      anchor="bottom"
      open={Boolean(setting_id)}
      onClose={() => navigate(`/settings/${setting_name}`)}
      sx={{ overflowY: 'auto' }}
    >
      {items && (
        <Stack p={2}>
          <Stack direction="row" justifyContent="space-between">
            {setting_name === 'users' && (
              <Avatar>
                <AccountCircle sx={{ fontSize: '3em' }} />
              </Avatar>
            )}
            <Typography variant="h4" pb={2} ml="auto">
              {setting_id === 'new' ? 'New' : 'Edit'} {SettingsConfig[setting_name].requests.model}
            </Typography>
          </Stack>
          {(items.data || setting_id === 'new') && (
            <FormContainer>
              {Object.entries(SettingsConfig[setting_name].options).map(([field, option]) => {
                return (
                  <TextField
                    key={`${field}-${setting_id}`}
                    required={option.required}
                    multiline={option.isText}
                    minRows={option.isText ? 4 : 1}
                    label={option.label}
                    {...register(field)}
                    error={errors[field] ? true : false}
                    helperText={errors[field]?.message || ' '}
                    sx={option.hidden ? { display: 'none' } : { width: '100%' }}
                  />
                );
              })}
              <Stack direction="row">
                <Button color="error" sx={{ ml: 'auto', mr: 2 }} onClick={() => navigate(`/settings/${setting_name}`)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Stack>
            </FormContainer>
          )}
        </Stack>
      )}
    </Drawer>
  );
};

export default EditSettings;
