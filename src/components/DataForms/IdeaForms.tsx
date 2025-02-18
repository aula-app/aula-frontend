import { addIdeaCategory, getCategories, removeIdeaCategory } from '@/services/categories';
import { addIdea, addIdeaBox, editIdea, getIdeaBoxes, removeIdeaBox } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import CategoryField from '../DataFields/CategoriesField';
import SelectBoxField from '../DataFields/SelectBoxField';

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
  const { room_id } = useParams();

  const [box, setBox] = useState<string>('');
  const [category, setCategory] = useState(0);
  const [startingBox, setStartingBox] = useState<string>('');
  const [startingCategory, setStartingCategory] = useState(0);
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
    const responseBox = response.data.map((box) => box.hash_id)[0];
    setBox(responseBox);
    setStartingBox(responseBox);
  };

  const fetchIdeaCategories = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getCategories(defaultValues.hash_id);
    if (!response.data) return;
    const responseCategory = response.data.map((category) => category.id)[0];
    setCategory(responseCategory);
    setStartingCategory(responseCategory);
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
      room_id: data.room_hash_id || room_id,
      title: data.title,
      content: data.content,
      custom_field1: data.custom_field1,
      custom_field2: data.custom_field2,
    });
    if (response.error || !response.data) return;
    setIdeaBox(response.data.hash_id);
    setIdeaCategory(response.data.hash_id);
    onClose();
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
    setIdeaBox(defaultValues?.hash_id);
    setIdeaCategory(defaultValues?.hash_id);
    onClose();
  };

  const setIdeaBox = async (idea_id: string) => {
    if (!idea_id) return;
    if (box === startingBox) return;
    if (box !== '') await addIdeaBox(idea_id, box);
    else await removeIdeaBox(idea_id, startingBox);
  };

  const setIdeaCategory = async (idea_id: string) => {
    if (!idea_id) return;
    if (category === startingCategory) return;
    if (category !== 0) await addIdeaCategory(idea_id, category);
    else await removeIdeaCategory(idea_id, startingCategory);
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
            {checkPermissions(40) && (
              <Stack direction="row" gap={2}>
                {/* <SelectRoomField control={control} disabled={isLoading} /> */}
                <SelectBoxField defaultValue={box} onChange={setBox} disabled={isLoading} />
                <CategoryField
                  defaultValue={category}
                  onChange={(updates) => setCategory(updates)}
                  disabled={isLoading}
                />
              </Stack>
            )}
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

export default IdeaForms;
