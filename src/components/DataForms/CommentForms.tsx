import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, StatusField } from '../DataFields';
import { addComment, CommentArguments, editComment } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { useParams } from 'react-router-dom';

/**
 * CommentForms component is used to create or edit an idea.
 *
 * @component
 */

interface CommentFormsProps {
  onClose: () => void;
  defaultValues?: CommentType;
}

const CommentForms: React.FC<CommentFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const { idea_id } = useParams();

  const schema = yup.object({
    content: yup.string().required(t('forms.validation.required')),
  } as Record<keyof CommentArguments, any>);

  const { reset, control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newComment(data);
      } else {
        await updateComment(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newComment = async (data: SchemaType) => {
    if (!idea_id) return;
    const request = await addComment({
      idea_id: idea_id,
      content: data.content,
    });
    if (!request.error) onClose();
  };

  const updateComment = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const request = await editComment({
      comment_id: defaultValues.hash_id,
      content: data.content,
      status: data.status,
    });
    if (!request.error) onClose();
  };

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
                var: t(`scopes.comments.name`).toLowerCase(),
              })}
            </Typography>
            {checkPermissions('comments', 'status') && <StatusField control={control} />}
          </Stack>
          <Stack gap={2}>
            {/* content */}
            <MarkdownEditor name="content" control={control} required disabled={isLoading} />
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

export default CommentForms;
