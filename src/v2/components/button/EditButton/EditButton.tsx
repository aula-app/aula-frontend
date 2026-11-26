import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { useModal, useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';

interface EditFormProps {
  /** Persists the edit; resolves `true` on success so the form can reset. */
  onSubmit: (data: any) => Promise<boolean>;
  /** Dismisses the modal without saving. */
  onCancel: () => void;
}

interface EditButtonProps {
  /** Localized scope name for the modal title and success toast, e.g. `t('scopes.boxes.name')`. */
  scopeLabel: string;
  /** Title of the item being edited, surfaced in the modal title. */
  subject?: string;
  /** Performs the save. Resolve with a response carrying `error` to surface a toast. */
  onSave: (data: any) => Promise<{ error?: string | null }>;
  /** Renders the modal form; wire its submit/cancel to the provided handlers. */
  renderForm: (props: EditFormProps) => React.ReactNode;
  /** Called after a successful edit (e.g. to refetch the list). */
  onChanged?: () => void;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
  /** Hide the button entirely, e.g. when the permission check fails. */
  hidden?: boolean;
}

/**
 * Opens a form in a modal and persists edits via `onSave`. API errors surface as
 * a toast and the form stays open so the user can retry; a successful save shows
 * an "updated" toast, closes the modal and notifies `onChanged`.
 */
const EditButton = ({ scopeLabel, subject, onSave, renderForm, onChanged, onOpen, hidden = false }: EditButtonProps) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  const handleSubmit = async (data: any): Promise<boolean> => {
    const response = await onSave(data);

    if (response.error) {
      toast.error(response.error || t('errors.failed'));
      return false;
    }

    toast.success(t('settings.messages.updated', { var: scopeLabel }));
    closeModal();
    onChanged?.();
    return true;
  };

  const handleClick = () => {
    onOpen?.();
    openModal(
      subject ? t('actions.editNamed', { var: subject }) : t('actions.edit', { var: scopeLabel }),
      renderForm({ onSubmit: handleSubmit, onCancel: closeModal })
    );
  };

  if (hidden) return null;

  return (
    <IconButton
      aria-label={t('v2.ui.button.edit')}
      hint={t('v2.ui.button.edit')}
      data-testid={TEST_IDS.EDIT_BUTTON}
      onClick={handleClick}
    >
      <Icon type="edit" size="1.2em" />
    </IconButton>
  );
};

export default EditButton;
