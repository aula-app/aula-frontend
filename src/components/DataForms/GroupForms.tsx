import { addGroup, editGroup, GroupArguments } from '@/services/groups';
import { GroupType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';

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
    if (request.error || !request.data) return;
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
    onClose();
  };

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.categories.name`).toLowerCase(),
              })}
            </Typography>
            {checkPermissions(40) && <StatusField control={control} />}
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
            <MarkdownEditor name="description_public" control={control} required disabled={isLoading} />
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default GroupForms;
