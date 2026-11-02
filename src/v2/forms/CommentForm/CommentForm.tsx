import { TEST_IDS } from '@/test-ids';
import { CommentType } from '@/types/Scopes';
import Button from '@/v2/components/button/Button';
import RichEditor from '@/v2/components/input/RichEditor';
import { useDraftStorage } from '@/v2/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

const MAX_CHAR_COUNT = 1000;

interface CommentFormProps {
  defaultValues?: CommentType;
  /** Returns `true` when the comment was persisted, so the form can clear its draft. */
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
  onErrorClose?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  onErrorClose,
}) => {
  const { t } = useTranslation();
  const { idea_id } = useParams<{ idea_id: string }>();

  const schema = yup.object().shape({
    content: yup
      .string()
      .max(
        MAX_CHAR_COUNT,
        t('forms.validation.contentTooLong', { scope: t('scopes.comments.name'), max: MAX_CHAR_COUNT })
      )
      .required(t('forms.validation.required')),
  });

  const form = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: { content: defaultValues?.content || '' },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { clearDraft } = useDraftStorage(form, {
    storageKey: `v2-commentform-draft-${idea_id ?? 'unknown'}`,
    enabled: !defaultValues,
  });

  const handleFormSubmit = async (data: any) => {
    const success = await onSubmit(data);
    if (success) clearDraft();
  };

  const handleCancel = () => {
    clearDraft();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3" data-testid={TEST_IDS.COMMENT_FORM}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichEditor
            label={t('settings.columns.content')}
            required
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            maxLength={MAX_CHAR_COUNT}
            error={errors.content ? (errors.content.message as string) : undefined}
            data-testid="comment-form-content"
          />
        )}
      />

      {((errors.root as any)?.message || error) && (
        <div className="flex items-center justify-between text-sm text-red-600 p-3 bg-red-50 rounded-lg" role="alert">
          <span>{(errors.root as any)?.message || error}</span>
          {onErrorClose && (
            <button
              type="button"
              onClick={onErrorClose}
              className="text-red-600 hover:text-red-700 font-semibold"
              aria-label={t('ui.common.dismiss')}
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button
          text
          color="error"
          onClick={handleCancel}
          disabled={isLoading}
          data-testid={TEST_IDS.COMMENT_FORM_CANCEL}
        >
          {t('actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading} data-testid={TEST_IDS.COMMENT_FORM_SUBMIT}>
          {isLoading ? t('actions.submitting') : t('actions.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
