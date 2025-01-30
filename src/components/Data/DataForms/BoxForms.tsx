import { BoxFormData } from '@/views/BoxPhase/BoxPhaseView';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, SelectField, SelectRoomField, StatusField } from '../DataFields';
import { BoxType } from '@/types/Scopes';
import { checkPermissions, phaseOptions } from '@/utils';
import AdvancedFields from '../DataFields/AdvancedFields';

/**
 * BoxForms component is used to create or edit an idea.
 *
 * @component
 */

interface BoxFormsProps {
  onClose: () => void;
  defaultValues?: BoxType;
  onSubmit: (data: BoxFormData) => void;
}

const BoxForms: React.FC<BoxFormsProps> = ({ defaultValues = {}, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.boxes.name`).toLowerCase() })}
            </Typography>
            {checkPermissions(40) && <StatusField control={control} />}
          </Stack>

          <Stack gap={2}>
            {/* name */}
            <TextField
              {...register('name')}
              label={t('settings.columns.name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              required
            />
            {/* description */}
            <MarkdownEditor name="description_public" control={control} required />
            {checkPermissions(40) && (
              <AdvancedFields>
                <SelectRoomField control={control} />
                <SelectField control={control} name="phase_id" options={phaseOptions} defaultValue={10} />
              </AdvancedFields>
            )}
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

export default BoxForms;
