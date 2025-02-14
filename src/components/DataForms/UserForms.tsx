import {
  addUser,
  addUserRoom,
  editUser,
  EditUserArguments,
  getUserRooms,
  removeUserRoom,
  UserArguments,
} from '@/services/users';
import { UserType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, RoleField, StatusField } from '../DataFields';
import RoomField from '../DataFields/RoomField';
import { SelectOptionsType, UpdateType } from '@/types/SettingsTypes';

/**
 * UserForms component is used to create or edit an user.
 *
 * @component
 */

interface UserFormsProps {
  children?: React.ReactNode;
  onClose: () => void;
  defaultValues?: UserType;
}

const UserForms: React.FC<UserFormsProps> = ({ children, defaultValues, onClose }) => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<string[]>([]);
  const [updateRooms, setUpdateRooms] = useState<UpdateType>({ add: [], remove: [] });

  const schema = yup.object({
    about_me: yup.string().nullable(),
    displayname: yup.string().required(t('forms.validation.required')),
    email: yup.string().nullable(),
    realname: yup.string().required(t('forms.validation.required')),
    status: yup.number(),
    userlevel: yup.number(),
    username: yup.string().required(t('forms.validation.required')),
  } as Record<keyof UserType, any>);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      displayname: defaultValues ? ' ' : '',
      email: defaultValues ? ' ' : '',
      realname: defaultValues ? ' ' : '',
      username: defaultValues ? ' ' : '',
    },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const fetchUserRooms = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getUserRooms(defaultValues.hash_id);
    if (!response.data) return;
    const rooms = response.data.map((room) => room.hash_id);
    setRooms(rooms);
  };

  const onSubmit = async (data: SchemaType, e?: React.BaseSyntheticEvent) => {
    if (!defaultValues) {
      await newUser(data);
    } else {
      await updateUser(data);
    }
    onClose();
  };

  const setUserRooms = async (user_id: string) => {
    const addPromises = updateRooms.add.map((room_id) => addUserRoom(user_id, room_id));
    const removePromises = updateRooms.remove.map((room_id) => removeUserRoom(user_id, room_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  const newUser = async (data: SchemaType) => {
    const response = await addUser({
      about_me: data.about_me,
      displayname: data.displayname,
      email: data.email,
      realname: data.realname,
      status: data.status || 1,
      userlevel: data.userlevel || 20,
      username: data.username,
    });
    if (response.error || !response.data) return;
    await setUserRooms(response.data.hash_id);
  };

  const updateUser = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const response = await editUser({
      about_me: data.about_me,
      displayname: data.displayname,
      email: data.email,
      realname: data.realname,
      status: data.status,
      user_id: defaultValues?.hash_id,
      userlevel: data.userlevel,
      username: data.username,
    });
    if (response.error) return;
    await setUserRooms(defaultValues.hash_id);
  };

  useEffect(() => {
    reset({ ...defaultValues });
    fetchUserRooms();
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.users.name`).toLowerCase(),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {children}
              {checkPermissions(40) && <StatusField control={control} />}
            </Stack>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={2}>
            <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
              <TextField
                fullWidth
                required
                label={t(`settings.columns.displayname`)}
                size="small"
                error={!!errors.displayname}
                helperText={`${errors.displayname?.message || ''}`}
                {...register('displayname')}
              />
              <TextField
                fullWidth
                required
                label={t(`settings.columns.username`)}
                size="small"
                error={!!errors.username}
                helperText={`${errors.username?.message || ''}`}
                {...register('username')}
              />
              <TextField
                fullWidth
                required
                label={t(`settings.columns.realname`)}
                size="small"
                error={!!errors.realname}
                helperText={`${errors.realname?.message || ''}`}
                {...register('realname')}
              />
              <TextField
                fullWidth
                label={t(`settings.columns.email`)}
                size="small"
                error={!!errors.email}
                helperText={`${errors.email?.message || ''}`}
                {...register('email')}
              />
              {checkPermissions(40) && Number(defaultValues?.userlevel) < 50 && <RoleField control={control} />}
              {checkPermissions(40) && (
                <RoomField defaultValues={rooms} onChange={(updates) => setUpdateRooms(updates)} />
              )}
            </Stack>
            <MarkdownEditor name="about_me" control={control} sx={{ flex: 2, minWidth: `min(300px, 100%)` }} />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default UserForms;
