import { addSurvey } from '@/services/boxes';
import { getRoom } from '@/services/rooms';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';
import { getDefaultDurations } from '@/services/config';

/**
 * SurveyForms component is used to create or edit an idea.
 *
 * @component
 */

interface SurveyFormsProps {
  onClose: () => void;
}

const SurveyForms: React.FC<SurveyFormsProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { room_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState<number>(5);

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
    phase_duration_3: yup.number().required(t('forms.validation.required')),
    idea_headline: yup.string().required(t('forms.validation.required')),
    idea_content: yup.string().required(t('forms.validation.required')),
  });

  const {
    setValue,
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '' },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const getDefaultDuration = async () => {
    if (!room_id) return;
    const response = await getRoom(room_id);
    if (response.data?.phase_duration_3) {
      setDefaultDuration(response.data.phase_duration_3);
      return;
    }

    getDefaultDurations().then((response) => {
      if (response.data.length > 0) setDefaultDuration(response.data[3]);
    });
  };

  const onSubmit = async (data: SchemaType) => {
    if (!room_id) return;
    
    setError('root', {});
    setIsLoading(true);
    
    const response = await addSurvey({
      name: data.name,
      description_public: data.description_public,
      idea_headline: data.idea_headline,
      idea_content: data.idea_content,
      phase_duration_3: data.phase_duration_3,
      room_id: room_id,
    });
    
    setIsLoading(false);
    
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    
    if (!response.data) return;
    onClose();
  };

  useEffect(() => {
    setValue('phase_duration_3', defaultDuration);
  }, [defaultDuration]);

  useEffect(() => {
    getDefaultDuration();
  }, [room_id]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">{t(`actions.add`, { var: t(`scopes.surveys.name`).toLowerCase() })}</Typography>
          </Stack>

          <Stack gap={2}>
            <TextField
              {...register('name')}
              label={t('settings.columns.name')}
              error={!!errors.name}
              helperText={`${errors.name?.message || ''}`}
              fullWidth
              required
              disabled={isLoading}
            />
            <MarkdownEditor name="description_public" control={control} required disabled={isLoading} />
            <TextField
              {...register('idea_headline')}
              label={t('settings.columns.idea_headline')}
              error={!!errors.idea_headline}
              helperText={`${errors.idea_headline?.message || ''}`}
              fullWidth
              required
              disabled={isLoading}
            />
            <MarkdownEditor name="idea_content" control={control} required disabled={isLoading} />
            <TextField
              {...register('phase_duration_3')}
              label={t(`settings.columns.phase_duration`)}
              type="number"
              required
              disabled={isLoading}
              error={!!errors.phase_duration_3}
              helperText={`${errors.phase_duration_3?.message || ''}`}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">{t('ui.units.days')}</InputAdornment> },
              }}
            />
          </Stack>
          {errors.root && (
            <Typography color="error" variant="body2">
              {errors.root.message}
            </Typography>
          )}
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

export default SurveyForms;
