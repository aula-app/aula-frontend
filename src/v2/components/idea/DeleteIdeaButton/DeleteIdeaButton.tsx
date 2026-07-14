import { deleteIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteIdeaButtonProps {
  idea: IdeaType;
  onChanged?: () => void;
  onOpen?: () => void;
}

const DeleteIdeaButton = ({ idea, onChanged, onOpen }: DeleteIdeaButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const response = await deleteIdea(idea.hash_id);
      if (response.error) {
        toast.error(response.error || t('errors.failed'));
        return;
      }
      toast.success(t('ui.accessibility.itemsDeleted', { count: 1, type: t('scopes.ideas.name') }));
      setOpen(false);
      onChanged?.();
    } finally {
      setPending(false);
    }
  };

  const handleClick = () => {
    onOpen?.();
    setOpen(true);
  };

  // Owner (self) or role >= 30 may delete; hide the action otherwise.
  if (!checkPermissions('ideas', 'delete', idea.user_hash_id)) return null;

  return (
    <>
      <IconButton
        aria-label={t('v2.ui.button.delete')}
        aria-haspopup="dialog"
        data-testid={TEST_IDS.DELETE_BUTTON}
        onClick={handleClick}
      >
        <Icon type="delete" size="1.2em" />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        role="alertdialog"
        title={t('deletion.headline', { var: t('scopes.ideas.name') })}
      >
        <div className="flex flex-col gap-4 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-error-fg">
            <Icon type="alert" size="1.2em" /> {t('v2.ui.dialog.delete.title', { var: t('scopes.ideas.name') })}
          </h3>
          <p className="whitespace-pre-line">{t('v2.ui.dialog.delete.description', { var: t('scopes.ideas.name') })}</p>
          <div className="flex justify-end gap-2">
            <Button text onClick={() => setOpen(false)} disabled={pending} data-testid={TEST_IDS.DELETE_IDEA_CANCEL}>
              {t('actions.cancel')}
            </Button>
            <Button color="error" onClick={handleDelete} disabled={pending} data-testid={TEST_IDS.DELETE_IDEA_CONFIRM}>
              {t('actions.delete')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteIdeaButton;
