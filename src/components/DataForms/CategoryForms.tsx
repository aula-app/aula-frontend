import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import { CategoryType } from '@/types/Scopes';
import { CategoryArguments } from '@/services/categories';
import { Category } from '@mui/icons-material';
import IconField from '../DataFields/IconField';

/**
 * CategoryForms component is used to create or edit an idea.
 *
 * @component
 */

interface CategoryFormsProps {
  onClose: () => void;
  defaultValues?: CategoryType;
  onSubmit: (data: CategoryArguments) => void;
}

const CategoryForms: React.FC<CategoryFormsProps> = ({ defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_internal: yup.string().required(t('forms.validation.required')),
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
              label={t('settings.columns.name')}
              error={!!errors.name}
              helperText={`${errors.name?.message || ''}`}
              fullWidth
              {...register('name')}
              required
            />
            {/* content */}
            <IconField name="description_internal" control={control} />
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
