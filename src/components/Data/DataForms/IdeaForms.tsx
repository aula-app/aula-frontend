import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';
import { IdeaFormData } from '@/views/WildIdeas/WildIdeasView';

/**
 * IdeaForms component is used to create or edit an idea.
 *
 * @component
 */

interface IdeaFormsProps {
  onClose: () => void;
  defaultValues?: IdeaFormData;
  onSubmit: (data: IdeaFormData) => void;
}

const IdeaForms: React.FC<IdeaFormsProps> = ({ defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    title: yup.string().required(t('forms.validation.required')),
    content: yup.string().required(t('forms.validation.required')),
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
      <Typography variant="h4">
        {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.ideas.name`).toLowerCase() })}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          {/* title */}
          <TextField
            {...register('title')}
            label={t('settings.columns.title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
            required
          />
          {/* content */}
          <MarkdownEditor name="content" control={control} required />
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

export default IdeaForms;
