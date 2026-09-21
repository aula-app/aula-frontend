import TextInput from '@/v2/components/input/TextInput';
import Button from '@/v2/components/button/Button';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { getIdeasByBox } from '@/services/ideas';
import { phases } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import RoomField from '../fields/RoomField';
import PhaseField from '../fields/PhaseField';
import IdeaField from '../fields/IdeaField';
import { SelectOption } from '@/v2/components/input/SelectInput';
import RichEditor from '@/v2/components/input/RichEditor';
import { useDraftStorage } from '@/v2/hooks';

const MAX_CHAR_COUNT = 1000;
const MAX_NAME_LENGTH = 200;

interface BoxFormProps {
  defaultValues?: BoxType;
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  contextRoomId?: string;
  contextPhaseId?: string;
}

const BoxForm: React.FC<BoxFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  contextRoomId,
  contextPhaseId,
}) => {
  const { t } = useTranslation();

  const hasRoomContext = contextRoomId !== undefined;

  const schema = yup.object().shape({
    ...(hasRoomContext ? {} : { room: yup.string().required(t('forms.validation.required')) }),
    name: yup
      .string()
      .max(MAX_NAME_LENGTH, t('forms.validation.titleTooLong', { scope: t('scopes.boxes.name'), max: MAX_NAME_LENGTH }))
      .required(t('forms.validation.required')),
    description_public: yup
      .string()
      .max(MAX_CHAR_COUNT, t('forms.validation.contentTooLong', { scope: t('scopes.boxes.name'), max: MAX_CHAR_COUNT }))
      .optional(),
    phase_id: yup.string().required(t('forms.validation.required')),
  });

  const form = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      room: contextRoomId || defaultValues?.room_hash_id || '',
      name: defaultValues?.name || '',
      description_public: defaultValues?.description_public || '',
      phase_id: String(defaultValues?.phase_id || contextPhaseId || '10'),
      ideas: [] as SelectOption[],
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const [assignedIdeas, setAssignedIdeas] = useState<string[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(!!defaultValues?.hash_id);

  useEffect(() => {
    const boxId = defaultValues?.hash_id;
    if (!boxId) return;

    let active = true;
    setLoadingIdeas(true);
    getIdeasByBox({ topic_id: boxId })
      .then((response) => {
        if (!active) return;
        const boxIdeas = Array.isArray(response.data) ? response.data : [];
        const ideas = boxIdeas.map((idea) => ({ value: idea.hash_id, label: idea.title }));
        setAssignedIdeas(ideas.map((idea) => idea.value));
        setValue('ideas', ideas);
      })
      .finally(() => active && setLoadingIdeas(false));

    return () => {
      active = false;
    };
  }, [defaultValues?.hash_id, setValue]);

  const roomId = contextRoomId || watch('room');
  const phaseColor = phases[watch('phase_id') as `${RoomPhases}`] ?? 'wild';

  const { clearDraft } = useDraftStorage(form, {
    storageKey: `v2-boxform-draft-${contextRoomId ?? 'unknown'}`,
    enabled: !defaultValues,
  });

  const handleFormSubmit = async (data: any) => {
    const selected: string[] = (data.ideas || []).map((idea: SelectOption) => idea.value);
    const success = await onSubmit({
      ...data,
      ideas: {
        add: selected.filter((ideaId) => !assignedIdeas.includes(ideaId)),
        remove: assignedIdeas.filter((ideaId) => !selected.includes(ideaId)),
      },
    });
    if (success) clearDraft();
  };

  const handleCancel = () => {
    clearDraft();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3" data-testid="box-form">
      {!hasRoomContext && (
        <Controller
          name="room"
          control={control}
          render={({ field }) => <RoomField value={field.value} onChange={field.onChange} disabled={isLoading} />}
        />
      )}

      <Controller
        name="phase_id"
        control={control}
        render={({ field }) => (
          <PhaseField
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            error={errors.phase_id ? (errors.phase_id.message as string) : undefined}
            data-testid="box-form-phase"
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label={t('settings.columns.title')}
            required
            disabled={isLoading}
            error={errors.name ? (errors.name.message as string) : undefined}
            data-testid="box-form-name"
          />
        )}
      />

      <Controller
        name="description_public"
        control={control}
        render={({ field }) => (
          <RichEditor
            label={t('settings.columns.description_public')}
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            maxLength={MAX_CHAR_COUNT}
            error={errors.description_public ? (errors.description_public.message as string) : undefined}
            data-testid="box-form-description"
          />
        )}
      />

      {(errors.root as any)?.message && (
        <div className="flex items-center justify-between text-sm text-red-600 p-3 bg-red-50 rounded-lg" role="alert">
          <span>{(errors.root as any).message}</span>
        </div>
      )}

      {roomId && (
        <Controller
          name="ideas"
          control={control}
          render={({ field }) => (
            <IdeaField
              roomId={roomId}
              value={field.value}
              onChange={field.onChange}
              color={phaseColor}
              loadingValue={loadingIdeas}
              disabled={isLoading}
              data-testid="box-form-ideas"
            />
          )}
        />
      )}

      <div className="flex gap-3 justify-end">
        <Button text color="error" onClick={handleCancel} disabled={isLoading} data-testid="box-form-cancel">
          {t('actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="box-form-submit">
          {isLoading ? t('actions.submitting') : t('actions.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default BoxForm;
