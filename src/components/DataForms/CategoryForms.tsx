import { addCategory, CategoryArguments, editCategory } from '@/services/categories';
import { CategoryType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { StatusField } from '../DataFields';
import IconField from '../DataFields/IconField';

/**
 * CategoryForms component is used to create or edit an idea.
 *
 * @component
 */

interface CategoryFormsProps {
  onClose: () => void;
  defaultValues?: CategoryType;
}

const CategoryForms: React.FC<CategoryFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_internal: yup.string().required(t('forms.validation.required')),
  } as Record<keyof CategoryArguments, any>);

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

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newCategory(data);
      } else {
        await updateCategory(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newCategory = async (data: SchemaType) => {
    const request = await addCategory({
      name: data.name,
      description_internal: data.description_internal,
      status: data.status,
    });
    if (request.error || !request.data) return;
    onClose();
  };

  const updateCategory = async (data: SchemaType) => {
    if (!defaultValues?.id) return;
    const request = await editCategory({
      category_id: defaultValues.id,
      name: data.name,
      description_internal: data.description_internal,
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.categories.name`).toLowerCase(),
              })}
            </Typography>
            {checkPermissions('categories', 'status') && <StatusField control={control} />}
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
              disabled={isLoading}
            />
            {/* content */}
            <IconField name="description_internal" control={control} disabled={isLoading} />
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

export default CategoryForms;
