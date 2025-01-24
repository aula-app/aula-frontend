import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';

/**
 * IdeaForms component is used to create or edit an idea.
 *
 * @component
 */

interface IdeaFormsProps {
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
}

const IdeaForms: React.FC<IdeaFormsProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup
    .object({
      title: yup.string().required(t('forms.validation.required')),
      content: yup.string().required(t('forms.validation.required')),
    })
    .required();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
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
        <MarkdownEditor name="content" control={control} />
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
  );
};

export default IdeaForms;
