import {
  addGroup,
  addUserToGroup,
  editGroup,
  getGroupUsers,
  GroupArguments,
  removeUserFromGroup,
} from '@/services/groups';
import { GroupType } from '@/types/Scopes';
import { UpdateType } from '@/types/SettingsTypes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import UsersField from '../DataFields/UsersField';

/**
 * GroupForms component is used to create or edit an idea.
 *
 * @component
 */

interface GroupFormsProps {
  onClose: () => void;
  defaultValues?: GroupType;
}

const GroupForms: React.FC<GroupFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [userUpdates, setUserUpdates] = useState<UpdateType>({ add: [], remove: [] });
  const [existingUsers, setExistingUsers] = useState<string[]>([]);

  const schema = yup.object({
    group_name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string(),
  } as Record<keyof GroupArguments, any>);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      group_name: defaultValues ? ' ' : '',
      description_public: defaultValues ? ' ' : '',
    },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newGroup(data);
      } else {
        await updateGroup(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newGroup = async (data: SchemaType) => {
    const request = await addGroup({
      group_name: data.group_name,
      description_public: data.description_public,
      status: data.status,
    });
    if (request.error || typeof request.data !== 'number') return;

    // Add selected users to the newly created group
    const group_id = request.data;
    await Promise.all(userUpdates.add.map((userId) => addUserToGroup({ user_id: userId, group_id: group_id })));

    onClose();
  };

  const updateGroup = async (data: SchemaType) => {
    if (!defaultValues?.id) return;
    const request = await editGroup({
      group_id: defaultValues?.id,
      group_name: data.group_name,
      description_public: data.description_public,
      status: data.status,
    });
    if (request.error) return;

    // Update users in the group
    const groupId = defaultValues.id;

    // Remove users
    await Promise.all(userUpdates.remove.map((userId) => removeUserFromGroup({ user_id: userId, group_id: groupId })));

    // Add users
    await Promise.all(userUpdates.add.map((userId) => addUserToGroup({ user_id: userId, group_id: groupId })));

    onClose();
  };

  // Fetch existing users when editing a group
  useEffect(() => {
    const fetchGroupUsers = async () => {
      if (defaultValues?.id) {
        try {
          setIsLoading(true);
          const response = await getGroupUsers(defaultValues.id);
          if (response.data) {
            const userIds = response.data.map((user) => user.hash_id);
            setExistingUsers(userIds);
          }
        } catch (error) {
          // Error fetching group users
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGroupUsers();
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.groups.name`).toLowerCase(),
              })}
            </Typography>
            {checkPermissions('groups', 'status') && <StatusField control={control} />}
          </Stack>
          <Stack gap={2}>
            {/* name */}
            <TextField
              label={t('settings.columns.group_name')}
              error={!!errors.group_name}
              helperText={`${errors.group_name?.message || ''}`}
              fullWidth
              {...register('group_name')}
              required
              disabled={isLoading}
            />
            {/* content */}
            <UsersField defaultValues={existingUsers} onChange={setUserUpdates} disabled={isLoading} />
            <MarkdownEditor name="description_public" control={control} required disabled={isLoading} />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error" aria-label={t('actions.cancel')}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading} aria-label={isLoading ? t('actions.loading') : t('actions.confirm')}>
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default GroupForms;
