import { useDraftStorage } from '@/hooks';
import { addSpecialRoles, addUser, addUserRoom, editUser, getUserRooms, removeUserRoom } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { RoleTypes, UpdateType } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import RoomRolesField from '../DataFields/RoomRolesField';
import SelectRole from '../SelectRole';

/**
 * UserForms component is used to create or edit an user.
 *
 * @component
 */

interface UserFormsProps {
  onClose: () => void;
  defaultValues?: UserType;
}

const UserForms: React.FC<UserFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState<string[]>([]);
  const [updateRooms, setUpdateRooms] = useState<UpdateType>({ add: [], remove: [] });
  const [updateRoles, setUpdateRoles] = useState<{ room: string; role: RoleTypes }[]>();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    about_me: yup.string().nullable(),
    displayname: yup.string().required(t('forms.validation.required')),
    email: yup.string().nullable(),
    realname: yup.string().required(t('forms.validation.required')),
    status: yup.number(),
    userlevel: yup.number(),
    username: yup.string().required(t('forms.validation.required')),
  } as Record<keyof UserType, any>);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      displayname: defaultValues ? ' ' : '',
      email: defaultValues ? ' ' : '',
      realname: defaultValues ? ' ' : '',
      username: defaultValues ? ' ' : '',
      userlevel: defaultValues?.userlevel ?? 20,
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = form;

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: 'userform-draft-new',
    isNewRecord: !defaultValues,
    onCancel: onClose,
  });

  const fetchUserRooms = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getUserRooms(defaultValues.hash_id);
    if (!response.data) return;
    const rooms = response.data.map((room) => room.hash_id);
    setRooms(rooms);
  };

  const onUpdate = (updates: { room: string; role: RoleTypes | 0 }[]) => {
    const add = updates
      .filter((update) => update.role !== 0 && !rooms.includes(update.room))
      .map((update) => update.room);
    const remove = updates
      .filter((update) => update.role === 0 && rooms.includes(update.room))
      .map((update) => update.room);
    setUpdateRooms({ add, remove });
    setUpdateRoles(updates.filter((update) => update.role !== 0) as { room: string; role: RoleTypes }[]);
  };

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newUser(data);
      } else {
        await updateUser(data);
      }
      handleDraftSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  const newUser = async (data: SchemaType) => {
    // Clear any previous errors
    setError('username', {});
    setError('email', {});
    setError('root', {});

    const response = await addUser({
      about_me: data.about_me,
      displayname: data.displayname,
      email: data.email,
      realname: data.realname,
      status: data.status || 1,
      userlevel: data.userlevel || 20,
      username: data.username,
    });
    if (response.error || !response.data) {
      // Check if it's a duplicate username/email error (error_code 2)
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    await setUserRooms(response.data.hash_id);
    await setRoomRoles(response.data.hash_id);
    onClose();
  };

  const updateUser = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;

    // Clear any previous errors
    setError('username', {});
    setError('email', {});
    setError('root', {});

    const response = await editUser({
      about_me: data.about_me,
      displayname: data.displayname,
      email: data.email,
      realname: data.realname,
      status: data.status,
      userlevel: data.userlevel || defaultValues.userlevel,
      username: data.username,
      user_id: defaultValues.hash_id,
    });
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    await setUserRooms(defaultValues.hash_id);
    await setRoomRoles(defaultValues.hash_id);
    onClose();
  };

  const setUserRooms = async (user_id: string) => {
    const addPromises = updateRooms.add.map((room_id) => addUserRoom(user_id, room_id));
    const removePromises = updateRooms.remove.map((room_id) => removeUserRoom(user_id, room_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  const setRoomRoles = async (user_id: string) => {
    await Promise.all(updateRoles?.map((update) => addSpecialRoles(user_id, update.role, update.room)) || []);
  };

  useEffect(() => {
    reset({ ...defaultValues });
    fetchUserRooms();
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid={`${defaultValues ? 'edit' : 'add'}-user-form`}
        aria-label={t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.users.name`) })}
      >
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.users.name`).toLowerCase(),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {checkPermissions('users', 'status') && <StatusField control={control} disabled={isLoading} />}
            </Stack>
          </Stack>
          {errors.root && (
            <Typography color="error" variant="body2">
              {errors.root.message}
            </Typography>
          )}
          <Stack direction="row" flexWrap="wrap" gap={2}>
            <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label={t(`settings.columns.displayname`)}
                id="user-displayname"
                data-testid="user-displayname-input"
                size="small"
                error={!!errors.displayname}
                helperText={
                  <span id="displayname-error-message">
                    {typeof errors.displayname?.message === 'string' ? errors.displayname.message : ''}
                  </span>
                }
                {...register('displayname')}
                slotProps={{
                  input: {
                    'aria-labelledby': 'user-displayname-label',
                    'aria-invalid': !!errors.displayname,
                    'aria-errormessage': errors.displayname ? 'displayname-error-message' : undefined,
                  },
                  inputLabel: {
                    id: 'user-displayname-label',
                    htmlFor: 'user-displayname',
                  },
                }}
              />
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label={t(`settings.columns.username`)}
                id="user-username"
                data-testid="user-username-input"
                size="small"
                error={!!errors.username}
                helperText={
                  <span id="username-error-message">
                    {typeof errors.username?.message === 'string' ? errors.username.message : ''}
                  </span>
                }
                {...register('username')}
                slotProps={{
                  input: {
                    'aria-labelledby': 'user-username-label',
                    'aria-invalid': !!errors.username,
                    'aria-errormessage': errors.username ? 'username-error-message' : undefined,
                  },
                  inputLabel: {
                    id: 'user-username-label',
                    htmlFor: 'user-username',
                  },
                }}
              />
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label={t(`settings.columns.realname`)}
                id="user-realname"
                size="small"
                error={!!errors.realname}
                helperText={
                  <span id="realname-error-message">
                    {typeof errors.realname?.message === 'string' ? errors.realname.message : ''}
                  </span>
                }
                {...register('realname')}
                slotProps={{
                  input: {
                    'aria-labelledby': 'user-realname-label',
                    'aria-invalid': !!errors.realname,
                    'aria-errormessage': errors.realname ? 'realname-error-message' : undefined,
                  },
                  inputLabel: {
                    id: 'user-realname-label',
                    htmlFor: 'user-realname',
                  },
                }}
              />
              <TextField
                fullWidth
                disabled={isLoading}
                label={t(`settings.columns.email`)}
                id="user-email"
                size="small"
                error={!!errors.email}
                helperText={
                  <span id="email-error-message">
                    {typeof errors.email?.message === 'string' ? errors.email.message : ''}
                  </span>
                }
                {...register('email')}
                slotProps={{
                  input: {
                    'aria-labelledby': 'user-email-label',
                    'aria-invalid': !!errors.email,
                    'aria-errormessage': errors.email ? 'email-error-message' : undefined,
                  },
                  inputLabel: {
                    id: 'user-email-label',
                    htmlFor: 'user-email',
                  },
                }}
              />
              {defaultValues?.userlevel !== 60 && (
                <>
                  {checkPermissions('users', 'addRole') && (
                    <SelectRole
                      control={control}
                      sx={{ flex: 1 }}
                      disabled={isLoading}
                      noAdmin={!checkPermissions('users', 'createAdmin')}
                      name='userlevel'
                      size='small'
                    />
                  )}
                  {checkPermissions('rooms', 'addUser') && (
                    <RoomRolesField
                      rooms={rooms}
                      user={defaultValues}
                      defaultLevel={watch('userlevel')}
                      onUpdate={(data) => onUpdate(data)}
                      disabled={isLoading}
                    />
                  )}
                </>
              )}
            </Stack>
            <MarkdownEditor
              name="about_me"
              control={control}
              disabled={isLoading}
              sx={{ flex: 2, minWidth: `min(300px, 100%)` }}
            />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button
              onClick={handleCancel}
              color="error"
              data-testid="cancel-user-form"
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              data-testid="submit-user-form"
              aria-label={isLoading ? t('actions.loading') : t('actions.confirm')}
            >
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default UserForms;
