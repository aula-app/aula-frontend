import { addIdeaCategory, getCategories, removeIdeaCategory } from '@/services/categories';
import { addIdea, addIdeaBox, editIdea, getIdeaBoxes } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import SelectBoxField from '../DataFields/SelectBoxField';
import CategoryField from '../DataFields/CategoriesField';

/**
 * IdeaForms component is used to create or edit an idea.
 *
 * @component
 */

interface IdeaFormsProps {
  onClose: () => void;
  defaultValues?: IdeaType;
}

const IdeaForms: React.FC<IdeaFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [box, setBox] = useState<string>('');
  const [categories, setCategories] = useState<number[]>([]);
  const [updateCategories, setUpdateCategories] = useState<{ add: number[]; remove: number[] }>({
    add: [],
    remove: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    title: yup.string().required(t('forms.validation.required')),
    content: yup.string().required(t('forms.validation.required')),
  } as Record<keyof IdeaType, any>);

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: defaultValues ? ' ' : '' },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const fetchIdeaBox = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getIdeaBoxes(defaultValues.hash_id);
    if (!response.data) return;
    const box = response.data.map((box) => box.hash_id)[0];
    setBox(box);
  };

  const fetchIdeaCategories = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getCategories(defaultValues.hash_id);
    if (!response.data) return;
    const categories = response.data.map((category) => category.id);
    setCategories(categories);
  };

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newIdea(data);
      } else {
        await updateIdea(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newIdea = async (data: SchemaType) => {
    const response = await addIdea({
      room_id: data.room_hash_id,
      title: data.title,
      content: data.content,
      custom_field1: data.custom_field1,
      custom_field2: data.custom_field2,
    });
    if (response.error || !response.data) return;
    if (box) await addIdeaBox(response.data.hash_id, box);
    await setIdeaCategory(response.data.hash_id);
  };

  const updateIdea = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const response = await editIdea({
      room_id: data.room_hash_id,
      title: data.title,
      content: data.content,
      custom_field1: data.custom_field1,
      custom_field2: data.custom_field2,
      idea_id: defaultValues.hash_id,
    });
    if (response.error || !response.data) return;
    if (box) await addIdeaBox(defaultValues?.hash_id, box);
    await setIdeaCategory(defaultValues?.hash_id);
  };

  const setIdeaCategory = async (idea_id: string) => {
    const addPromises = updateCategories.add.map((category_id) => addIdeaCategory(idea_id, category_id));
    const removePromises = updateCategories.remove.map((category_id) => removeIdeaCategory(idea_id, category_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  useEffect(() => {
    reset({ ...defaultValues });
    fetchIdeaBox();
    fetchIdeaCategories();
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.ideas.name`).toLowerCase(),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {checkPermissions(40) && <StatusField control={control} />}
            </Stack>
          </Stack>
          <Stack gap={2}>
            {/* title */}
            <TextField
              {...register('title')}
              label={t('settings.columns.title')}
              error={!!errors.title}
              helperText={`${errors.title?.message || ''}`}
              fullWidth
              required
              disabled={isLoading}
            />
            {/* content */}
            <MarkdownEditor name="content" control={control} required disabled={isLoading} />
            <SelectBoxField defaultValue={box} onChange={setBox} disabled={isLoading} />
            <CategoryField
              defaultValues={categories}
              onChange={(updates) => setUpdateCategories(updates)}
              disabled={isLoading}
            />
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

export default IdeaForms;
