import Button from '@/v2/components/button/Button';
import RichEditor from '@/v2/components/input/RichEditor';
import SelectInput from '@/v2/components/input/SelectInput';
import { useDraftStorage } from '@/v2/hooks';
import { ReportArguments } from '@/services/messages';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const REPORT_REASONS = [
  'language',
  'harassment',
  'hate',
  'violence',
  'misinformation',
  'content',
  'spam',
  'privacy',
  'copyright',
  'other',
] as const;

interface ReportFormProps {
  /** Returns `true` when the report was persisted, so the form can clear its draft. */
  onSubmit: (data: ReportArguments) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const { t } = useTranslation();

  const reasonOptions = REPORT_REASONS.map((reason) => ({
    value: reason,
    label: t(`forms.report.${reason}`),
  }));

  const schema = yup.object().shape({
    report: yup.string().required(t('forms.validation.required')),
    content: yup.string().required(t('forms.validation.required')),
  });

  const form = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      report: '',
      content: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { clearDraft } = useDraftStorage(form, { storageKey: 'v2-reportform-draft-new', enabled: true });

  const handleFormSubmit = async (data: ReportArguments) => {
    const success = await onSubmit(data);
    if (success) clearDraft();
  };

  const handleCancel = () => {
    clearDraft();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3" data-testid="report-form">
      <Controller
        name="report"
        control={control}
        render={({ field }) => (
          <SelectInput
            label={t('scopes.reports.name')}
            options={reasonOptions}
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            required
            className="w-full"
            error={errors.report ? (errors.report.message as string) : undefined}
            data-testid="report-form-reason"
          />
        )}
      />

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
            error={errors.content ? (errors.content.message as string) : undefined}
            data-testid="report-form-content"
          />
        )}
      />

      <div className="flex gap-3 justify-end">
        <Button text color="error" onClick={handleCancel} disabled={isLoading} data-testid="report-form-cancel">
          {t('actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="report-form-submit">
          {isLoading ? t('actions.submitting') : t('actions.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;
