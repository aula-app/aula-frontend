import { editIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import { IdeaForm } from '@/v2/forms';
import { useModal, useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';

interface EditIdeaButtonProps {
  idea: IdeaType;
  /** Refetch the surrounding list after a successful edit. */
  onChanged?: () => void;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
}

/**
 * Opens the idea form pre-filled with the idea's values and persists edits via
 * `editIdea`. API errors surface as a toast; the form stays open so the user can
 * retry. Box/category editing is not wired yet (see IdeaForm), so only the
 * title, content and room are sent.
 */
const EditIdeaButton = ({ idea, onChanged, onOpen }: EditIdeaButtonProps) => {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  const handleSubmit = async (data: any): Promise<boolean> => {
    const response = await editIdea({
      idea_id: idea.hash_id,
      room_id: data.room || idea.room_hash_id,
      title: data.title,
      content: data.content,
    });

    if (response.error) {
      toast.error(response.error || t('errors.failed'));
      return false;
    }

    toast.success(t('settings.messages.updated', { var: t('scopes.ideas.name') }));
    closeModal();
    onChanged?.();
    return true;
  };

  const handleClick = () => {
    onOpen?.();
    openModal(
      t('actions.edit', { var: t('scopes.ideas.name') }),
      <IdeaForm
        defaultValues={idea}
        contextRoomId={idea.room_hash_id}
        contextBoxId=""
        onSubmit={handleSubmit}
        onCancel={closeModal}
      />
    );
  };

  // Owner (self) or role >= 30 may edit; hide the action otherwise.
  if (!checkPermissions('ideas', 'edit', idea.user_hash_id)) return null;

  return (
    <IconButton dense aria-label={t('v2.ui.button.edit')} data-testid={TEST_IDS.EDIT_BUTTON} onClick={handleClick}>
      <Icon type="edit" size="1.2em" />
    </IconButton>
  );
};

export default EditIdeaButton;
