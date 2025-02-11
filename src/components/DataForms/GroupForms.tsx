import { GroupArguments } from '@/services/groups';
import { GroupType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';

/**
 * CategoryForms component is used to create or edit an idea.
 *
 * @component
 */

interface CategoryFormsProps {
  onClose: () => void;
  defaultValues?: GroupType;
  onSubmit: (data: GroupArguments) => void;
}

const CategoryForms: React.FC<CategoryFormsProps> = ({ defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    group_name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
            />
            {/* content */}
            <MarkdownEditor name="description_public" control={control} required />
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

export default CategoryForms;
