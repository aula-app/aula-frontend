import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Chip, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';
import { IdeaFormData } from '@/views/WildIdeas/WildIdeasView';
import { checkPermissions } from '@/utils';
import AdvancedFields from '../DataFields/AdvancedFields';

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack gap={2}>
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
          {checkPermissions(40) && <AdvancedFields control={control} />}
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
  );
};

export default IdeaForms;
