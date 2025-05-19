import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
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

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Stack overflow="auto" p={2} gap={2}>
      <Typography variant="h1">{t(`actions.add`, { var: t(`scopes.bugs.name`).toLowerCase() })}</Typography>
      <form noValidate>
        <Stack gap={2}>
          {/* content */}
          <MarkdownEditor name="content" control={control} required />
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error" aria-label={t('actions.cancel')}>
              {t('actions.cancel')}
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)} aria-label={t('actions.confirm')}>
              {t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default BugForms;
