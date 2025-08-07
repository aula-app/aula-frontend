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

  const [options, setOptions] = useState<{ label: string; value: number; disabled: boolean }[]>(phaseOptions);

  const schema = yup.object({
    name: yup.string().required(t('forms.validation.required')),
    description_public: yup.string().required(t('forms.validation.required')),
    room_hash_id: yup.string(),
    phase_id: yup.string(),
    phase_duration_1: yup.number(),
    phase_duration_3: yup.number(),
    status: yup.number(),
  } as Record<keyof BoxType, any>);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValues ? ' ' : '',
      phase_duration_1: 0,
      phase_duration_3: 0,
    },
  });

  // Infer TypeScript type from the Yup schema
  type SchemaType = yup.InferType<typeof schema>;

  const fetchBoxIdeas = async () => {
    if (!defaultValues?.hash_id) return;
    const response = await getIdeasByBox({ topic_id: defaultValues.hash_id });
    if (!response.data) return;
    setIdeas(response.data);
  };

  const validatePhaseTransition = () => {
    let ideasWithApprovalStatus = 0;
    for (let idea of ideas) {
      if (idea.approved) ideasWithApprovalStatus += 1;
    }

    setOptions((prevOptions) =>
      prevOptions.map((option, index) => {
        // Prevent moving to Voting phase if there is still ideas waiting for approval
        if (index === 2) return { ...option, disabled: ideasWithApprovalStatus < ideas.length };

        // A Box can only change to results if it passed Voting phase
        if (index === 3 && defaultValues && Number(defaultValues['phase_id']) < 30)
          return { ...option, disabled: true };

        return phaseOptions[index];
      })
    );
  };

  const onSubmit = async (data: SchemaType) => {
    try {
      setError('root', {});
      setIsLoading(true);
      if (!defaultValues) {
        await newBox(data);
      } else {
        await updateBox(data);
      }
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
      phase_duration_3: data.phase_duration_3,
      status: data.status,
    });
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    if (!response.data) return;
    await setBoxIdeas(response.data.hash_id);
    onClose();
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
      phase_duration_3: data.phase_duration_3,
      status: data.status,
      topic_id: defaultValues.hash_id,
    });
    if (response.error) {
      setError('root', {
        type: 'manual',
        message: response.error || t('errors.default'),
      });
      return;
    }
    await setBoxIdeas(defaultValues.hash_id);
    onClose();
  };

  const setBoxIdeas = async (box_id: string) => {
    const addPromises = updateIdeas.add.map((idea_id) => addIdeaBox(idea_id, box_id));
    const removePromises = updateIdeas.remove.map((idea_id) => removeIdeaBox(idea_id, box_id));
    await Promise.all([...addPromises, ...removePromises]);
  };

  useEffect(() => {
    validatePhaseTransition();
  }, [ideas]);

  useEffect(() => {
    setRoom(watch('room_hash_id'));
  }, [watch('room_hash_id')]);

  useEffect(() => {
    reset({ ...defaultValues });
    fetchBoxIdeas();
  }, [JSON.stringify(defaultValues)]);

  return (
    <Stack p={2} overflow="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h1">
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
              {checkPermissions('rooms', 'addBox') && (
                <SelectRoomField control={control} setValue={setValue} disabled={isLoading} />
              )}
              {checkPermissions('boxes', 'changePhase') && (
                <SelectField
                  control={control}
                  name="phase_id"
                  options={options}
                  defaultValue={10}
                  disabled={isLoading}
                />
              )}
              {checkPermissions('boxes', 'changePhaseDuration') && (
                <PhaseDurationFields
                  control={control}
                  room={defaultValues?.room_hash_id}
                  disabled={isLoading}
                  setValue={setValue}
                />
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
          {errors.root && (
            <Typography color="error" variant="body2">
              {errors.root.message}
            </Typography>
          )}
          <Stack direction="row" justifyContent="end" gap={2}>
            <Button onClick={onClose} color="error" aria-label={t('actions.cancel')}>
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              aria-label={isLoading ? t('actions.loading') : t('actions.confirm')}
            >
              {isLoading ? t('actions.loading') : t('actions.confirm')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default BoxForms;
