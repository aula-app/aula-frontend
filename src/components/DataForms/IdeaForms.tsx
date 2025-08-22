import { addIdeaCategory, getCategories, removeIdeaCategory } from '@/services/categories';
import { addIdea, addIdeaBox, editIdea, getIdeaBoxes, removeIdeaBox } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { announceToScreenReader, checkPermissions } from '@/utils';
import { useDraftStorage } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const MAX_CHAR_COUNT = 1000; // Maximum character count for content
const MAX_TITLE_LENGTH = 200; // Maximum length for title

interface IdeaFormsProps {
  onClose: () => void;
  defaultValues?: IdeaType;
}

const IdeaForms: React.FC<IdeaFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();
  const { room_id, box_id } = useParams();

  const [box, setBox] = useState<string>(box_id || '');
  const [category, setCategory] = useState(0);
  const [startingBox, setStartingBox] = useState<string>('');
  const [startingCategory, setStartingCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    title: yup
      .string()
      .test(
        'len',
        t('forms.validation.titleTooLong', { scope: t('scopes.ideas.name'), max: MAX_TITLE_LENGTH }),
        (val) => String(val).length <= MAX_TITLE_LENGTH
      )
      .required(t('forms.validation.required')),
    content: yup
      .string()
      .test(
        'len',
        t('forms.validation.contentTooLong', { scope: t('scopes.ideas.name'), max: MAX_CHAR_COUNT }),
        (val) => String(val).length <= MAX_CHAR_COUNT
      )
      .required(t('forms.validation.required')),
  } as Record<keyof IdeaType, any>);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: defaultValues ? ' ' : '' },
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const {
    handleSubmit: handleDraftSubmit,
    handleCancel,
    loadDraft,
  } = useDraftStorage(form, {
    storageKey: 'ideaform-draft-new',
    isNewRecord: !defaultValues,
    selections: { box, category },
    onCancel: onClose,
  });

  const fetchIdeaBox = useCallback(async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getIdeaBoxes(defaultValues.hash_id);
    if (!response.data) return;
    const responseBox = response.data.map((box) => box.hash_id)[0];
    setBox(responseBox);
    setStartingBox(responseBox);
  }, [defaultValues?.hash_id]);

  const fetchIdeaCategories = useCallback(async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getCategories(defaultValues.hash_id);
    if (!response.data) return;
    const responseCategory = response.data.map((category) => category.id)[0];
    setCategory(responseCategory);
    setStartingCategory(responseCategory);
  }, [defaultValues?.hash_id]);

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      // Announce form submission to screen readers
      announceToScreenReader(t('ui.accessibility.processingRequest'), 'assertive');

      if (!defaultValues) {
        await newIdea(data);
      } else {
        await updateIdea(data);
      }

      // Clear draft storage
      handleDraftSubmit();

      // Announce successful form submission to screen readers
      announceToScreenReader(t('ui.accessibility.formSubmitted'), 'assertive');
      onClose();
    } catch {
      // Announce form submission failure to screen readers
      announceToScreenReader(t('ui.accessibility.formError'), 'assertive');
      setError('root', {
        type: 'manual',
        message: t('errors.default'),
      });
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
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    if (!response.data) return;
    setIdeaBox(response.data.hash_id);
    setIdeaCategory(response.data.hash_id);
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
      approved: defaultValues.approved,
    });
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    if (!response.data) return;
    setIdeaBox(defaultValues?.hash_id);
    setIdeaCategory(defaultValues?.hash_id);
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

  // Memoize the key properties of defaultValues to avoid unnecessary re-renders
  const defaultValuesKey = useMemo(() => {
    if (!defaultValues) return null;
    return {
      hash_id: defaultValues.hash_id,
      title: defaultValues.title,
      content: defaultValues.content,
      room_hash_id: defaultValues.room_hash_id,
      custom_field1: defaultValues.custom_field1,
      custom_field2: defaultValues.custom_field2,
      approved: defaultValues.approved,
    };
  }, [defaultValues]);

  useEffect(() => {
    const initializeForm = async () => {
      reset({ ...defaultValues });
      fetchIdeaBox();
      fetchIdeaCategories();

      // Load selections for new ideas only
      if (!defaultValues) {
        const savedSelections = loadDraft();
        if (savedSelections) {
          if (savedSelections.box) {
            setBox(savedSelections.box);
          }
          if (savedSelections.category) {
            setCategory(savedSelections.category);
          }
        }
      }
    };

    initializeForm();
  }, [defaultValuesKey, loadDraft, reset, fetchIdeaBox, fetchIdeaCategories]);

  return (
    <Stack p={2} overflow="auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid={`${defaultValues ? 'edit' : 'add'}-idea-form`}
        aria-label={t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.ideas.name`) })}
      >
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.ideas.name`),
              })}
            </Typography>
            <Stack direction="row" gap={2}>
              {checkPermissions('ideas', 'status') && <StatusField control={control} />}
            </Stack>
          </Stack>
          <Stack gap={2}>
            {/* title */}
            <TextField
              {...register('title')}
              label={t('settings.columns.title')}
              id="idea-title"
              data-testid="idea-title-input"
              error={!!errors.title}
              helperText={
                <span id="title-error-message">
                  {typeof errors.title?.message === 'string' ? errors.title.message : ''}
                </span>
              }
              fullWidth
              required
              disabled={isLoading}
              slotProps={{
                input: {
                  'aria-invalid': !!errors.title,
                  'aria-errormessage': errors.title ? 'title-error-message' : undefined,
                  'aria-labelledby': 'idea-title-label',
                },
                inputLabel: {
                  id: 'idea-title-label',
                  htmlFor: 'idea-title',
                },
              }}
            />
            {/* content */}
            <MarkdownEditor name="content" control={control} required disabled={isLoading} maxLength={MAX_CHAR_COUNT} />
            <Stack direction="row" gap={2}>
              {checkPermissions('boxes', 'addIdea') && (
                <SelectBoxField
                  defaultValue={box}
                  room_id={defaultValues?.room_hash_id || room_id}
                  onChange={(newBox) => {
                    setBox(newBox);
                  }}
                  disabled={isLoading}
                />
              )}
              {checkPermissions('ideas', 'addCategory') && (
                <CategoryField
                  defaultValue={category}
                  onChange={(newCategory) => {
                    setCategory(newCategory);
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
            <Button
              onClick={handleCancel}
              color="error"
              data-testid="cancel-idea-form"
              aria-label={t('actions.cancel')}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              data-testid="submit-idea-form"
              aria-label={isLoading ? t('actions.submitting') : t('actions.confirm')}
            >
              {isLoading ? t('actions.submitting') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>

        {/* Hidden status announcer for screen readers */}
        {isLoading && (
          <span
            aria-live="assertive"
            className="visually-hidden"
            style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
          >
            {t('actions.submitting')}
          </span>
        )}
      </form>
    </Stack>
  );
};

export default IdeaForms;
