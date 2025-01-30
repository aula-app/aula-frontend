import { checkPermissions } from '@/utils';
import { CommentFormData } from '@/views/Idea/Comment/CommentView';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';

/**
 * CommentForms component is used to create or edit an idea.
 *
 * @component
 */

interface CommentFormsProps {
  onClose: () => void;
  defaultValues?: CommentFormData;
  onSubmit: (data: CommentFormData) => void;
}

const CommentForms: React.FC<CommentFormsProps> = ({ defaultValues = {}, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    content: yup.string().required(t('forms.validation.required')),
  });

  const { reset, control, handleSubmit } = useForm({
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
            {checkPermissions(40) && <StatusField control={control} />}
          </Stack>
          <Stack gap={2}>
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

export default CommentForms;
