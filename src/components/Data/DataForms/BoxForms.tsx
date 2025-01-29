import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';
import { IdeaFormData } from '@/views/WildIdeas/WildIdeasView';
import { BoxFormData } from '@/views/BoxPhase/BoxPhaseView';

/**
 * BoxForms component is used to create or edit an idea.
 *
 * @component
 */

interface BoxFormsProps {
  onClose: () => void;
  defaultValues?: BoxFormData;
  onSubmit: (data: BoxFormData) => void;
}

const BoxForms: React.FC<BoxFormsProps> = ({ defaultValues = {}, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto" gap={2}>
      <Typography variant="h4">{t(`actions.add`, { var: t(`scopes.boxes.name`).toLowerCase() })}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          {/* name */}
          <TextField
            {...register('name')}
            label={t('settings.columns.name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />
          {/* description */}
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
      </form>
    </Stack>
  );
};

export default BoxForms;
