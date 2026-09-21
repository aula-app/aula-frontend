import Button from '@/v2/components/button/Button';
import RichEditor from '@/v2/components/input/RichEditor';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface RejectionFormProps {
  /** Argument already on record, so editing a rejection starts from what was written. */
  defaultValue?: string;
  onSubmit: (comment: string) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

/** The argument a moderator has to give before an idea can be turned down. */
const RejectionForm: React.FC<RejectionFormProps> = ({ defaultValue = '', onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();

  const schema = yup.object().shape({
    approval_comment: yup.string().trim().required(t('forms.validation.required')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { approval_comment: defaultValue },
  });

  return (
    <form
      onSubmit={handleSubmit(({ approval_comment }) => onSubmit(approval_comment))}
      className="flex flex-col gap-3"
      data-testid="rejection-form"
    >
      <Controller
        name="approval_comment"
        control={control}
        render={({ field }) => (
          <RichEditor
            label={t('v2.scopes.ideas.approval.reason')}
            required
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            error={errors.approval_comment?.message}
            data-testid="rejection-form-comment"
          />
        )}
      />

      <div className="flex gap-3 justify-end">
        <Button text onClick={onCancel} disabled={isLoading} data-testid="rejection-form-cancel">
          {t('actions.cancel')}
        </Button>
        <Button type="submit" color="error" disabled={isLoading} data-testid="rejection-form-submit">
          {isLoading ? t('actions.submitting') : t('v2.scopes.ideas.status.rejected')}
        </Button>
      </div>
    </form>
  );
};

export default RejectionForm;
