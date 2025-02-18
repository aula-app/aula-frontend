import { addBox, editBox } from '@/services/boxes';
import { addIdeaBox, getIdeasByBox, removeIdeaBox } from '@/services/ideas';
import { BoxType, IdeaType } from '@/types/Scopes';
import { UpdateType } from '@/types/SettingsTypes';
import { checkPermissions, phaseOptions } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form-mui';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { MarkdownEditor, PhaseDurationFields, SelectField, SelectRoomField, StatusField } from '../DataFields';
import IdeaField from '../DataFields/IdeaField';
import { useParams } from 'react-router-dom';

/**
 * BoxForms component is used to create or edit an idea.
 *
 * @component
 */

interface BoxFormsProps {
  onClose: () => void;
  defaultValues?: BoxType;
}

const BoxForms: React.FC<BoxFormsProps> = ({ defaultValues, onClose }) => {
  const { t } = useTranslation();
  const { room_id } = useParams();

  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [room, setRoom] = useState<string>(defaultValues?.room_hash_id || '');
  const [updateIdeas, setUpdateIdeas] = useState<UpdateType>({ add: [], remove: [] });
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
    room_hash_id: yup.string(),
    phase_id: yup.string(),
    phase_duration_1: yup.number(),
    phase_duration_2: yup.number(),
    phase_duration_3: yup.number(),
    phase_duration_4: yup.number(),
    status: yup.number(),
  } as Record<keyof BoxType, any>);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: defaultValues ? ' ' : '' },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const fetchBoxIdeas = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getIdeasByBox({ topic_id: defaultValues.hash_id });
    if (!response.data) return;
    setIdeas(response.data);
  };

  const onSubmit = async (data: SchemaType) => {
    try {
      setIsLoading(true);
      if (!defaultValues) {
        await newBox(data);
      } else {
        await updateBox(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const newBox = async (data: SchemaType) => {
    const response = await addBox({
      name: data.name,
      description_public: data.description_public,
      description_internal: data.description_internal,
      room_id: data.room_hash_id || room_id,
      phase_id: data.phase_id || 10,
      phase_duration_1: data.phase_duration_1,
      phase_duration_2: data.phase_duration_2,
      phase_duration_3: data.phase_duration_3,
      phase_duration_4: data.phase_duration_4,
      status: data.status,
    });
    if (response.error || !response.data) return;
    await setBoxIdeas(response.data.hash_id);
  };

  const updateBox = async (data: SchemaType) => {
    if (!defaultValues?.hash_id) return;
    const response = await editBox({
      name: data.name,
      description_public: data.description_public,
      description_internal: data.description_internal,
      room_id: data.room_hash_id,
      phase_id: data.phase_id,
      phase_duration_1: data.phase_duration_1,
      phase_duration_2: data.phase_duration_2,
      phase_duration_3: data.phase_duration_3,
      phase_duration_4: data.phase_duration_4,
      status: data.status,
      topic_id: defaultValues.hash_id,
    });
    if (response.error) return;
    await setBoxIdeas(defaultValues.hash_id);
  };

  const setBoxIdeas = async (box_id: string) => {
    const addPromises = updateIdeas.add.map((idea_id) => addIdeaBox(idea_id, box_id));
    const removePromises = updateIdeas.remove.map((idea_id) => removeIdeaBox(idea_id, box_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  useEffect(() => {
    setRoom(watch('room_hash_id'));
  }, [watch('room_hash_id')]);

  useEffect(() => {
    reset({ ...defaultValues });
    fetchBoxIdeas();
    fetchBoxIdeas();
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">
              {t(`actions.${defaultValues ? 'edit' : 'add'}`, { var: t(`scopes.boxes.name`).toLowerCase() })}
            </Typography>
            {checkPermissions('boxes', 'status') && <StatusField control={control} />}
          </Stack>

          <Stack gap={2}>
            <TextField
              {...register('name')}
              label={t('settings.columns.name')}
              error={!!errors.name}
              helperText={`${errors.name?.message || ''}`}
              fullWidth
              required
              disabled={isLoading}
            />
            <MarkdownEditor name="description_public" control={control} required disabled={isLoading} />
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
              {checkPermissions('rooms', 'addBox') && <SelectRoomField control={control} disabled={isLoading} />}
              {checkPermissions('boxes', 'changePhase') && (
                <SelectField
                  control={control}
                  name="phase_id"
                  options={phaseOptions}
                  defaultValue={10}
                  disabled={isLoading}
                />
              )}
              {checkPermissions('boxes', 'changePhaseDuration') && (
                <PhaseDurationFields control={control} room={defaultValues?.room_hash_id} disabled={isLoading} />
              )}
            </Stack>
            {room && (
              <IdeaField
                room={room}
                defaultValues={ideas}
                onChange={(updates) => setUpdateIdeas(updates)}
                disabled={isLoading}
              />
            )}
          </Stack>
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error">
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default BoxForms;
