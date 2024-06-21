import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, Drawer, Stack, Typography } from '@mui/material';
import { SettingNamesType } from '@/types/SettingsTypes';
import { useEffect, useState } from 'react';
import { SettingsConfig } from '@/utils/Settings';
import { databaseRequest } from '@/utils/requests';
import { ObjectPropByName, SingleResponseType } from '@/types/Generics';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppIcon } from '@/components';
import FormInput from '@/components/FormInput';

/** * Renders "Settings" drawer component view
 * url: /settings/:setting_name/:setting_id
 */
const EditSettings = () => {
  const navigate = useNavigate();
  const { setting_name, setting_id } = useParams() as { setting_name: SettingNamesType; setting_id: number | 'new' };

  const schema = SettingsConfig[setting_name].forms.reduce(
    (schema, form) => ({ ...schema, [form.column]: form.schema }),
    {}
  );
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yup.object(schema).required()),
  });

  const [items, setItems] = useState<SingleResponseType>({});

  const request = async (method: string, args: ObjectPropByName) =>
    await databaseRequest('model', {
      model: SettingsConfig[setting_name].model,
      method: method,
      arguments: args,
    });

  const dataFetch = async () =>
    await request(SettingsConfig[setting_name].requests.get, {
      [SettingsConfig[setting_name].requests.id]: setting_id,
    }).then((response: SingleResponseType) => setItems(response));

  const onSubmit = async (formData: Object) => {
    await request(
      setting_id === 'new' ? SettingsConfig[setting_name].requests.add : SettingsConfig[setting_name].requests.edit,
      {
        ...formData,
        [setting_id === 'new' ? SettingsConfig[setting_name].requests.id : 'updater_id']: setting_id === 'new' ? undefined : setting_id,
      }
    ).then((response) => {
      if (!response.success) return;
      navigate(`/settings/${setting_name}`);
    });
  };

  const updateValues = () => {
    if (!items.data) return;
    SettingsConfig[setting_name].forms.forEach((field) => {
      // @ts-ignore
      setValue(field.column, items.data[field.column] || field.value);
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
                <AppIcon name="avatar" />
              </Avatar>
            )}
            <Typography variant="h4" pb={2}>
              {setting_id === 'new' ? 'New' : 'Edit'} {SettingsConfig[setting_name].item}
            </Typography>
          </Stack>
          {(items.data || setting_id === 'new') && (
            <FormContainer>
              {SettingsConfig[setting_name].forms.map((field) => {
                return <FormInput key={field.column} content={field} register={register} errors={errors} />;
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
