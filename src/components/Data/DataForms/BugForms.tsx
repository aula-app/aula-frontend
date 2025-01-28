import { BugFormData } from '@/components/Buttons/BugButton/BugButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor } from '../DataFields';

/**
 * BugForms component is used to create or edit an idea.
 *
 * @component
 */

interface BugFormsProps {
  onClose: () => void;
  onSubmit: (data: BugFormData) => Promise<void>;
}

const BugForms: React.FC<BugFormsProps> = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup
    .object({
      content: yup.string().required(t('forms.validation.required')),
    })
    .required();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Stack p={2} overflow="auto" gap={2}>
      <Typography variant="h4">{t(`actions.add`, { var: t(`scopes.bugs.name`).toLowerCase() })}</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack>
          {/* content */}
          <MarkdownEditor name="description_public" control={control} required />
        </Stack>
        <Stack direction="row" justifyContent="end" gap={2}>
          <Button onClick={onClose} color="error">
            {t('actions.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('actions.confirm')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default BugForms;
