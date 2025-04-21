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
import { MarkdownEditor, RoleField, StatusField } from '../DataFields';
import RoomRolesField from '../DataFields/RoomRolesField';

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

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      displayname: defaultValues ? ' ' : '',
      email: defaultValues ? ' ' : '',
      realname: defaultValues ? ' ' : '',
      username: defaultValues ? ' ' : '',
      userlevel: defaultValues ? ' ' : 20,
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
      onClose();
    } finally {
      setIsLoading(false);
    }
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
    await setRoomRoles(response.data.hash_id);
  };

  const updateUser = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
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
    if (response.error) return;
    await setUserRooms(defaultValues.hash_id);
    await setRoomRoles(defaultValues.hash_id);
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

  // Generate unique IDs for form fields
  const formId = "user-form";
  const generateFieldId = (fieldName: string) => `${formId}-${fieldName}`;
  const generateErrorId = (fieldName: string) => `${formId}-${fieldName}-error`;

  return (
    <Stack p={2} overflow="auto">
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t('forms.user.title')}>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1" id={`${formId}-title`}>
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.users.name`).toLowerCase(),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {checkPermissions('users', 'status') && <StatusField control={control} disabled={isLoading} />}
            </Stack>
          </Stack>
          
          {/* Use fieldset and legend for grouped inputs */}
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="sr-only">{t('forms.user.personalInfo')}</legend>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              <Stack gap={1} sx={{ flex: 1, minWidth: `min(300px, 100%)` }}>
                {/* Display Name Field */}
                <TextField
                  id={generateFieldId('displayname')}
                  fullWidth
                  required
                  disabled={isLoading}
                  label={t(`settings.columns.displayname`)}
                  size="small"
                  error={!!errors.displayname}
                  helperText={`${errors.displayname?.message || ''}`}
                  {...register('displayname')}
                  inputProps={{
                    'aria-required': 'true',
                    'aria-invalid': !!errors.displayname,
                    'aria-describedby': errors.displayname ? generateErrorId('displayname') : undefined
                  }}
                  FormHelperTextProps={{
                    id: generateErrorId('displayname'),
                    role: errors.displayname ? 'alert' : undefined
                  }}
                />
                
                {/* Username Field */}
                <TextField
                  id={generateFieldId('username')}
                  fullWidth
                  required
                  disabled={isLoading}
                  label={t(`settings.columns.username`)}
                  size="small"
                  error={!!errors.username}
                  helperText={`${errors.username?.message || ''}`}
                  {...register('username')}
                  inputProps={{
                    'aria-required': 'true',
                    'aria-invalid': !!errors.username,
                    'aria-describedby': errors.username ? generateErrorId('username') : undefined
                  }}
                  FormHelperTextProps={{
                    id: generateErrorId('username'),
                    role: errors.username ? 'alert' : undefined
                  }}
                />
                
                {/* Real Name Field */}
                <TextField
                  id={generateFieldId('realname')}
                  fullWidth
                  required
                  disabled={isLoading}
                  label={t(`settings.columns.realname`)}
                  size="small"
                  error={!!errors.realname}
                  helperText={`${errors.realname?.message || ''}`}
                  {...register('realname')}
                  inputProps={{
                    'aria-required': 'true',
                    'aria-invalid': !!errors.realname,
                    'aria-describedby': errors.realname ? generateErrorId('realname') : undefined
                  }}
                  FormHelperTextProps={{
                    id: generateErrorId('realname'),
                    role: errors.realname ? 'alert' : undefined
                  }}
                />
                
                {/* Email Field */}
                <TextField
                  id={generateFieldId('email')}
                  fullWidth
                  disabled={isLoading}
                  label={t(`settings.columns.email`)}
                  size="small"
                  error={!!errors.email}
                  helperText={`${errors.email?.message || ''}`}
                  {...register('email')}
                  inputProps={{
                    'aria-invalid': !!errors.email,
                    'aria-describedby': errors.email ? generateErrorId('email') : undefined
                  }}
                  FormHelperTextProps={{
                    id: generateErrorId('email'),
                    role: errors.email ? 'alert' : undefined
                  }}
                />
                
                {/* Role and Room Settings */}
                {defaultValues?.userlevel !== 60 && (
                  <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend className="sr-only">{t('forms.user.roleSettings')}</legend>
                    {checkPermissions('users', 'addRole') && (
                      <RoleField
                        control={control}
                        disabled={isLoading}
                        sx={{ flex: 1 }}
                        noAdmin={!checkPermissions('users', 'createAdmin')}
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
                  </fieldset>
                )}
              </Stack>
              
              {/* About Me Editor */}
              <div role="group" aria-labelledby={generateFieldId('about-me-label')}>
                <Typography id={generateFieldId('about-me-label')} variant="caption" className="sr-only">
                  {t('settings.columns.about_me')}
                </Typography>
                <MarkdownEditor
                  name="about_me"
                  control={control}
                  disabled={isLoading}
                  sx={{ flex: 2, minWidth: `min(300px, 100%)` }}
                  label={t('settings.columns.about_me')}
                />
              </div>
            </Stack>
          </fieldset>
          
          {/* Action Buttons */}
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button 
              onClick={onClose} 
              color="error"
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
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
