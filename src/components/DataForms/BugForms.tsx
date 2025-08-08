import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useDraftStorage } from '@/hooks';
import { MarkdownEditor } from '../DataFields';
import { BugArguments } from '@/services/messages';

/**
 * BugForms component is used to create or edit an idea.
 *
 * @component
 */

interface BugFormsProps {
  onClose: () => void;
  onSubmit: (data: BugArguments) => Promise<void>;
}

const BugForms: React.FC<BugFormsProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup
    .object({
      content: yup.string().required(t('forms.validation.required')),
    })
    .required(t('forms.validation.required'));

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      content: '',
    },
  });

  const { control, handleSubmit } = form;

  const { handleSubmit: handleDraftSubmit, handleCancel } = useDraftStorage(form, {
    storageKey: 'bug-form-draft-new',
    isNewRecord: true, // Bugs are always new (no edit mode)
    onCancel: onClose,
  });

  const handleFormSubmit = async (data: BugArguments) => {
    await onSubmit(data);
    handleDraftSubmit();
  };

  return (
    <Stack overflow="auto" p={2} gap={2}>
      <Typography variant="h1">{t(`actions.add`, { var: t(`scopes.bugs.name`).toLowerCase() })}</Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Stack gap={2}>
          {/* content */}
          <MarkdownEditor name="content" control={control} required />
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={handleCancel} color="error" aria-label={t('actions.cancel')}>
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

export default BugForms;
