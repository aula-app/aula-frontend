import { addComment, CommentArguments, editComment } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { useDraftStorage } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';

/**
 * CommentForms component is used to create or edit an idea.
 *
 * @component
 */

const MAX_CHAR_COUNT = 1000; // Maximum character count for content

interface CommentFormsProps {
  onClose: () => void;
  defaultValues?: CommentType;
}

const CommentForms: React.FC<CommentFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);
  const { idea_id } = useParams();

  const schema = yup.object({
    content: yup
      .string()
      .test(
        'len',
        t('forms.validation.contentTooLong', { scope: t('scopes.comments.name'), max: MAX_CHAR_COUNT }),
        (val) => String(val).length <= MAX_CHAR_COUNT
      )
      .required(t('forms.validation.required')),
  } as Record<keyof CommentArguments, any>);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: `comment-form-draft-${idea_id || 'unknown'}`,
    isNewRecord: !defaultValues,
    onCancel: onClose,
  });

  const onSubmit = async (data: SchemaType) => {
    try {
      setError('root', {});
      setIsLoading(true);
      let success = false;
      if (!defaultValues) {
        success = await newComment(data);
      } else {
        success = await updateComment(data);
      }
      if (success) {
        handleDraftSubmit();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const newComment = async (data: SchemaType): Promise<boolean> => {
    if (!idea_id) return false;
    const request = await addComment({
      idea_id: idea_id,
      content: data.content,
    });
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return false;
    }
    if (!request.error_code) {
      onClose();
      return true;
    }
    return false;
  };

  const updateComment = async (data: SchemaType): Promise<boolean> => {
    if (!defaultValues?.hash_id) return false;
    const request = await editComment({
      comment_id: defaultValues.hash_id,
      content: data.content,
      status: data.status,
    });
    if (request.error) {
      setError('root', {
        type: 'manual',
        message: request.error || t('errors.default'),
      });
      return false;
    }
    if (!request.error_code) {
      onClose();
      return true;
    }
    return false;
  };

  useEffect(() => {
    reset({ ...defaultValues });
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2} data-testid="comment-form">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.comments.name`),
              })}
            </Typography>
            {/* {checkPermissions('comments', 'status') && <StatusField control={control} />} */}
          </Stack>
          <Stack gap={2}>
            {/* content */}
            <MarkdownEditor name="content" control={control} required disabled={isLoading} maxLength={MAX_CHAR_COUNT} />
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
              data-testid="confirm-comment-button"
            >
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default CommentForms;
