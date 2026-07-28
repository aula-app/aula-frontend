import TextInput from '@/v2/components/input/TextInput';
import Button from '@/v2/components/button/Button';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BoxType } from '@/types/Scopes';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RoomField from '../fields/RoomField';
import RichEditor from '@/v2/components/input/RichEditor';
import { useDraftStorage } from '@/v2/hooks';

const MAX_CHAR_COUNT = 1000;
const MAX_NAME_LENGTH = 200;

interface BoxFormProps {
  defaultValues?: BoxType;
  /** Returns `true` when the box was persisted, so the form can clear its draft. */
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  contextRoomId?: string;
  error?: string | null;
  onErrorClose?: () => void;
}

const BoxForm: React.FC<BoxFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  contextRoomId,
  error,
  onErrorClose,
}) => {
  const { t } = useTranslation();

  const hasRoomContext = contextRoomId !== undefined;

  const schema = yup.object().shape({
    ...(hasRoomContext ? {} : { room: yup.string().required(t('forms.validation.required')) }),
    name: yup
      .string()
      .max(
        MAX_NAME_LENGTH,
        t('forms.validation.titleTooLong', { scope: t('scopes.boxes.name'), max: MAX_NAME_LENGTH })
      )
      .required(t('forms.validation.required')),
    description_public: yup
      .string()
      .max(
        MAX_CHAR_COUNT,
        t('forms.validation.contentTooLong', { scope: t('scopes.boxes.name'), max: MAX_CHAR_COUNT })
      )
      .optional(),
  });

  const form = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      room: contextRoomId || defaultValues?.room_hash_id || '',
      name: defaultValues?.name || '',
      description_public: defaultValues?.description_public || '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { clearDraft } = useDraftStorage(form, {
    storageKey: `v2-boxform-draft-${contextRoomId ?? 'unknown'}`,
    enabled: !defaultValues,
  });

  const handleFormSubmit = async (data: any) => {
    const success = await onSubmit(data);
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
            label={t('settings.columns.content')}
            value={field.value}
            onChange={field.onChange}
            disabled={isLoading}
            maxLength={MAX_CHAR_COUNT}
            error={errors.description_public ? (errors.description_public.message as string) : undefined}
            data-testid="box-form-description"
          />
        )}
      />

      {((errors.root as any)?.message || error) && (
        <div className="flex items-center justify-between text-sm text-red-600 p-3 bg-red-50 rounded-lg" role="alert">
          <span>{(errors.root as any)?.message || error}</span>
          {onErrorClose && (
            <button
              type="button"
              onClick={onErrorClose}
              className="text-red-600 hover:text-red-700 font-semibold"
              aria-label={t('ui.common.dismiss')}
            >
              ✕
            </button>
          )}
        </div>
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
