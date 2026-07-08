import TextInput from '@/v2/components/input/TextInput';
import Button from '@/v2/components/button/Button';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IdeaType } from '@/types/Scopes';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BoxField from '../fields/BoxField';
import CategoryField from '../fields/CategoryField';
import RoomField from '../fields/RoomField';
import RichEditor from '@/v2/components/input/RichEditor';
import { useDraftStorage } from '@/v2/hooks';

const MAX_CHAR_COUNT = 1000;
const MAX_TITLE_LENGTH = 200;

interface IdeaFormProps {
  defaultValues?: IdeaType;
  /** Returns `true` when the idea was persisted, so the form can clear its draft. */
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  isLoading?: boolean;
  contextRoomId?: string;
  contextBoxId?: string;
  error?: string | null;
  onErrorClose?: () => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  contextRoomId,
  contextBoxId,
  error,
  onErrorClose,
}) => {
  const { t } = useTranslation();

  const hasRoomContext = contextRoomId !== undefined;
  const hasBoxContext = contextBoxId !== undefined;

  const schema = yup.object().shape({
    ...(hasRoomContext ? {} : { room: yup.string().required(t('forms.validation.required')) }),
    title: yup
      .string()
      .max(MAX_TITLE_LENGTH, t('forms.validation.titleTooLong', { max: MAX_TITLE_LENGTH }))
      .required(t('forms.validation.required')),
    content: yup
      .string()
      .max(MAX_CHAR_COUNT, t('forms.validation.contentTooLong', { max: MAX_CHAR_COUNT }))
      .required(t('forms.validation.required')),
    ...(hasBoxContext ? {} : { box: yup.string().optional() }),
    category: yup.string().optional(),
  });

  const form = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      room: contextRoomId || defaultValues?.room_hash_id || '',
      title: defaultValues?.title || '',
      content: defaultValues?.content || '',
      box: contextBoxId || '',
      category: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { clearDraft } = useDraftStorage(form, {
    storageKey: `v2-ideaform-draft-${contextRoomId ?? 'unknown'}`,
    enabled: !defaultValues,
  });

  const roomValue = useWatch({ control, name: 'room' });

  const handleFormSubmit = async (data: any) => {
    const success = await onSubmit(data);
    if (success) clearDraft();
  };

  const handleCancel = () => {
    clearDraft();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <h3>{t('v2.ui.actions.add', { var: t('v2.scopes.ideas.singular') })}</h3>
      <div className="flex flex-col">
        {/* Room - only show if no context */}
        {!hasRoomContext && (
          <Controller
            name="room"
            control={control}
            render={({ field }) => <RoomField value={field.value} onChange={field.onChange} disabled={isLoading} />}
          />
        )}

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={t('settings.columns.title')}
              required
              disabled={isLoading}
              error={errors.title ? (errors.title.message as string) : undefined}
              data-testid="idea-form-title"
            />
          )}
        />

        {/* Content */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichEditor
              label={t('settings.columns.content')}
              required
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              maxLength={MAX_CHAR_COUNT}
              error={errors.content ? (errors.content.message as string) : undefined}
              data-testid="idea-form-content"
            />
          )}
        />

        {/* Box and Category */}
        <div className="flex gap-4">
          {!hasBoxContext && (
            <Controller
              name="box"
              control={control}
              render={({ field }) => (
                <div className="flex-1">
                  <BoxField
                    roomId={roomValue}
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </div>
              )}
            />
          )}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className={hasBoxContext ? 'w-full' : 'flex-1'}>
                <CategoryField value={field.value || ''} onChange={field.onChange} disabled={isLoading} />
              </div>
            )}
          />
        </div>

        {/* Error Summary */}
        {((errors.root as any)?.message || error) && (
          <div className="flex items-center justify-between text-sm text-red-600 p-3 bg-red-50 rounded-lg" role="alert">
            <span>{(errors.root as any)?.message || error}</span>
            {onErrorClose && (
              <button
                onClick={onErrorClose}
                className="text-red-600 hover:text-red-700 font-semibold"
                aria-label="Close error"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button text color="error" onClick={handleCancel} disabled={isLoading} data-testid="idea-form-cancel">
          {t('actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="idea-form-submit">
          {isLoading ? t('actions.submitting') : t('actions.confirm')}
        </Button>
      </div>
    </form>
  );
};

export default IdeaForm;
