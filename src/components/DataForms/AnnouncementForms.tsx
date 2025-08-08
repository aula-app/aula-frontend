import { addAnnouncement, AnnouncementArguments, editAnnouncement } from '@/services/announcements';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useDraftStorage } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { ConsentField, MarkdownEditor, StatusField } from '../DataFields';

/**
 * AnnouncementForms component is used to create or edit an idea.
 *
 * @component
 */

interface AnnouncementFormsProps {
  onClose: () => void;
  defaultValues?: AnnouncementType | MessageType;
}

const AnnouncementForms: React.FC<AnnouncementFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    headline: yup.string().required(t('forms.validation.required')),
    body: yup.string().required(t('forms.validation.required')),
    user_needs_to_consent: yup.number(),
    consent_text: yup.string().required(t('forms.validation.required')),
    status: yup.number(),
    target_group: yup.number(),
    target_id: yup.number(),
  } as Record<keyof AnnouncementArguments, any>);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      headline: defaultValues?.headline || '',
      body: defaultValues?.body || '',
      user_needs_to_consent: 1,
      consent_text: t('actions.agree'),
      status: defaultValues?.status || 1,
    },
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

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: 'announcement-form-draft-new',
    isNewRecord: !defaultValues,
    onCancel: onClose,
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      setError('root', {});
      setIsLoading(true);
      if (!defaultValues) {
        await newAnnouncement(data);
      } else {
        await updateAnnouncement(data);
      }
      handleDraftSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  const newAnnouncement = async (data: SchemaType) => {
    const request = await addAnnouncement({
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return;
    }
    if (!request.error_code) onClose();
  };

  const updateAnnouncement = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const request = await editAnnouncement({
      text_id: defaultValues.hash_id,
      headline: data.headline,
      body: data.body,
      user_needs_to_consent: data.user_needs_to_consent,
      consent_text: data.consent_text,
      status: data.status,
    });
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return;
    }
    if (!request.error_code) onClose();
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
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.announcements.name`).toLowerCase() })}
            </Typography>
            {checkPermissions('announcements', 'status') && <StatusField control={control} />}
          </Stack>

          <Stack gap={2}>
            <TextField
              required
              label={t('settings.columns.headline')}
              error={!!errors.headline}
              helperText={`${errors.headline?.message || ''}`}
              fullWidth
              {...register('headline')}
            />
            <MarkdownEditor name="body" control={control} required />
            <ConsentField control={control} required />
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
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default AnnouncementForms;
