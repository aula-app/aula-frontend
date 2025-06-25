import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, SelectField } from '../DataFields';
import { ReportArguments } from '@/services/messages';
import { SelectOptionsType } from '@/types/SettingsTypes';

/**
 * ReportForms component is used to create or edit an idea.
 *
 * @component
 */

interface ReportFormsProps {
  onClose: () => void;
  onSubmit: (data: ReportArguments) => Promise<void>;
}

export const ReportOptions = [
  { value: 'language', label: 'forms.report.language' },
  { value: 'harassment', label: 'forms.report.harassment' },
  { value: 'hate', label: 'forms.report.hate' },
  { value: 'violence', label: 'forms.report.violence' },
  { value: 'misinformation', label: 'forms.report.misinformation' },
  { value: 'content', label: 'forms.report.content' },
  { value: 'spam', label: 'forms.report.spam' },
  { value: 'privacy', label: 'forms.report.privacy' },
  { value: 'copyright', label: 'forms.report.copyright' },
  { value: 'other', label: 'forms.report.other' },
] as SelectOptionsType;

const ReportForms: React.FC<ReportFormsProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup
    .object({
      report: yup.string().required(t('forms.validation.required')),
    })
    .required(t('forms.validation.required'));

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Stack p={2} overflow="auto" gap={2}>
      <Typography variant="h1">{t(`actions.add`, { var: t(`scopes.reports.name`).toLowerCase() })}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <SelectField name="report" options={ReportOptions} control={control} />
          {/* content */}
          <MarkdownEditor name="content" control={control} />
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error" aria-label={t('actions.cancel')}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" aria-label={t('actions.confirm')}>
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default ReportForms;
