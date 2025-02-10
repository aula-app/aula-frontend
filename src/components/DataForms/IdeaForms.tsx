import { IdeaArguments } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import AddCategoriesButton from '../Buttons/AddCategories';

/**
 * IdeaForms component is used to create or edit an idea.
 *
 * @component
 */

interface IdeaFormsProps {
  children?: React.ReactNode;
  onClose: () => void;
  defaultValues?: IdeaArguments;
  onSubmit: (data: IdeaArguments) => void;
}

const IdeaForms: React.FC<IdeaFormsProps> = ({ children, defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

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
    defaultValues: {},
  });

  useEffect(() => {
    reset({ ...defaultValues });
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
              {children}
              {checkPermissions(40) && <StatusField control={control} />}
            </Stack>
          </Stack>
          <Stack gap={2}>
            {/* title */}
            <TextField
              {...register('title')}
              label={t('settings.columns.title')}
              error={!!errors.title}
              helperText={`${errors.title?.message || ' '}`}
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
        </Stack>
      </form>
    </Stack>
  );
};

export default IdeaForms;
