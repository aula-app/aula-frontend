import { addRoom, editRoom, getRoomUsers, RoomArguments } from '@/services/rooms';
import { addUserRoom, removeUserRoom } from '@/services/users';
import { RoomType } from '@/types/Scopes';
import { UpdateType } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { useDraftStorage } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, PhaseDurationFields, StatusField } from '../DataFields';
import RoomImageSelector from '../DataFields/RoomImageSelector';
import UsersField from '../DataFields/UsersField';

/**
 * RoomForms component is used to create or edit an room.
 *
 * @component
 */

const DEFAULT_PHASE_DURATION = 14; // Default duration in days

interface RoomFormsProps {
  isDefault?: boolean;
  onClose: () => void;
  defaultValues?: RoomType;
}

const RoomForms: React.FC<RoomFormsProps> = ({ defaultValues, isDefault = false, onClose }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<string[]>([]);
  const [updateUsers, setUpdateUsers] = useState<UpdateType>({ add: [], remove: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Save user selections to sessionStorage (only for new rooms)
  const saveUserSelections = useCallback((updates?: UpdateType) => {
    if (!defaultValues) { // Only for new rooms
      try {
        const userIdsToSave = updates ? updates.add : updateUsers.add;
        sessionStorage.setItem('roomform-users-draft', JSON.stringify(userIdsToSave));
      } catch (error) {
        console.warn('Failed to save user selections:', error);
      }
    }
  }, [defaultValues, updateUsers.add]);

  // Load user selections from sessionStorage (only for new rooms)
  const loadUserSelections = useCallback(() => {
    if (!defaultValues) { // Only for new rooms
      try {
        const saved = sessionStorage.getItem('roomform-users-draft');
        if (saved) {
          const savedUserIds = JSON.parse(saved);
          setUpdateUsers({ add: savedUserIds, remove: [] });
        }
      } catch (error) {
        console.warn('Failed to load user selections:', error);
      }
    }
  }, [defaultValues]);

  // Clear user selections from sessionStorage
  const clearUserSelections = useCallback(() => {
    try {
      sessionStorage.removeItem('roomform-users-draft');
    } catch (error) {
      console.warn('Failed to clear user selections:', error);
    }
  }, []);

  const schema = yup.object({
    room_name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
    description_internal: yup.string().nullable(),
    phase_duration_1: yup.number().required(t('forms.validation.required')),
    phase_duration_3: yup.number().required(t('forms.validation.required')),
  } as Record<keyof RoomArguments, any>);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      room_name: defaultValues ? ' ' : '',
      phase_duration_1: defaultValues?.phase_duration_1 || DEFAULT_PHASE_DURATION,
      phase_duration_3: defaultValues?.phase_duration_3 || DEFAULT_PHASE_DURATION,
      description_public: defaultValues?.description_public || '',
      description_internal: defaultValues?.description_internal || null,
      status: defaultValues?.status,
    },
  });

  const {
    setValue,
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: 'roomform-draft-new',
    isNewRecord: !defaultValues,
    onCancel: () => {
      clearUserSelections();
      onClose();
    },
  });

  const fetchRoomUsers = async () => {
    if (!defaultValues?.hash_id || isDefault) return;
    const response = await getRoomUsers(defaultValues.hash_id);
    if (!response.data) return;
    const users = response.data.map((user) => user.hash_id);
    setUsers(users);
  };

  const onSubmit = async (data: SchemaType) => {
    try {
      setError('root', {});
      setIsLoading(true);
      if (!defaultValues) {
        await newRoom(data);
      } else {
        await updateRoom(data);
      }
      clearUserSelections();
      handleDraftSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  const newRoom = async (data: SchemaType) => {
    const response = await addRoom({
      room_name: data.room_name,
      description_internal: data.description_internal,
      description_public: data.description_public,
      internal_info: data.internal_info,
      phase_duration_1: data.phase_duration_1,
      phase_duration_3: data.phase_duration_3,
      status: data.status,
    });
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    if (!response.data) return;
    await setUserRooms(response.data.hash_id);
    onClose();
  };

  const updateRoom = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const response = await editRoom({
      room_name: data.room_name,
      description_internal: data.description_internal,
      description_public: data.description_public,
      internal_info: data.internal_info,
      phase_duration_1: data.phase_duration_1,
      phase_duration_3: data.phase_duration_3,
      status: data.status,
      room_id: defaultValues.hash_id,
    });

    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    await setUserRooms(defaultValues.hash_id);
    onClose();
  };

  const setUserRooms = async (room_id: string) => {
    const addPromises = updateUsers.add.map((user_id) => addUserRoom(user_id, room_id));
    const removePromises = updateUsers.remove.map((user_id) => removeUserRoom(user_id, room_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  useEffect(() => {
    reset({ ...defaultValues });
    fetchRoomUsers();
    
    // Load user selections for new rooms, clear for edit rooms
    if (!defaultValues) {
      loadUserSelections();
    } else {
      clearUserSelections();
    }
  }, [JSON.stringify(defaultValues), loadUserSelections, clearUserSelections]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          {!isDefault && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h1">
                {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                  var: t(`scopes.rooms.name`).toLowerCase(),
                })}
              </Typography>
              {checkPermissions('rooms', 'status') && <StatusField control={control} />}
            </Stack>
          )}
          <Stack gap={2} direction="row" flexWrap="wrap">
            <Controller
              name="description_internal"
              control={control}
              render={({ field }) => (
                <>
                  <RoomImageSelector
                    image={field.value || control._defaultValues['description_internal'] || 'DI:0:0'}
                    onClose={() => reset({ ...defaultValues })}
                    onSubmit={(value) => setValue('description_internal', value)}
                  />
                </>
              )}
            />
            <Stack gap={2} flex={1}>
              <TextField
                fullWidth
                required
                disabled={isLoading}
                label={t(`settings.columns.room_name`)}
                size="small"
                error={!!errors.room_name}
                helperText={`${errors.room_name?.message || ''}`}
                {...register('room_name')}
              />
              <MarkdownEditor
                required
                disabled={isLoading}
                name="description_public"
                control={control}
                sx={{ flex: 2, minWidth: `min(300px, 100%)` }}
              />
              {!isDefault && (
                <PhaseDurationFields
                  control={control}
                  required
                  disabled={isLoading}
                  room={defaultValues?.hash_id}
                  setValue={setValue}
                />
              )}
              {checkPermissions('rooms', 'addUser') && !isDefault && (
                <UsersField
                  defaultValues={defaultValues ? users : updateUsers.add}
                  onChange={(updates) => {
                    setUpdateUsers(updates);
                    // Save immediately with the new updates
                    saveUserSelections(updates);
                  }}
                  disabled={isLoading}
                />
              )}
            </Stack>
          </Stack>
          {errors.root && (
            <Typography color="error" variant="body2">
              {errors.root.message}
            </Typography>
          )}
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={handleCancel} color="error" aria-label={t('actions.cancel')}>
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

export default RoomForms;
