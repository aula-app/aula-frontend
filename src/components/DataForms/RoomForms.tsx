import { RoomArguments } from '@/services/rooms';
import { checkPermissions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, PhaseDurationFields, StatusField } from '../DataFields';
import RoomImageSelector from '../DataFields/RoomImageSelector';

/**
 * RoomForms component is used to create or edit an room.
 *
 * @component
 */

interface RoomFormsProps {
  onClose: () => void;
  defaultValues?: RoomArguments;
  onSubmit: (data: RoomArguments) => void;
}

const RoomForms: React.FC<RoomFormsProps> = ({ defaultValues, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const schema = yup.object({
    room_name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
    description_internal: yup.string().required(t('forms.validation.required')),
    phase_duration_1: yup.number().required(t('forms.validation.required')),
    phase_duration_2: yup.number().required(t('forms.validation.required')),
    phase_duration_3: yup.number().required(t('forms.validation.required')),
    phase_duration_4: yup.number().required(t('forms.validation.required')),
  } as Record<keyof RoomArguments, any>);

  const {
    setValue,
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
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, {
                var: t(`scopes.rooms.name`).toLowerCase(),
              })}
            </Typography>
            {checkPermissions(40) && <StatusField control={control} />}
          </Stack>
          <Stack gap={2} direction="row" flexWrap="wrap">
            <Controller
              name="description_internal"
              control={control}
              render={({ field }) => (
                <>
                  <RoomImageSelector
                    image={field.value || control._defaultValues['description_internal'] || 'DI:0:0'}
                    onClose={() => reset({ ...defaultValues })}
                    onSubmit={(value) => setValue('description_internal', value)}
                  />
                </>
              )}
            />
            <Stack gap={2} flex={1}>
              <TextField
                fullWidth
                required
                label={t(`settings.columns.room_name`)}
                size="small"
                error={!!errors.room_name}
                helperText={`${errors.room_name?.message || ' '}`}
                {...register('room_name')}
              />
              <MarkdownEditor
                required
                name="description_public"
                control={control}
                sx={{ flex: 2, minWidth: `min(300px, 100%)` }}
              />
              <PhaseDurationFields control={control} required />
            </Stack>
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

export default RoomForms;
