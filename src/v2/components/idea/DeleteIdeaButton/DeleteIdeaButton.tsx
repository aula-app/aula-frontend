import { deleteIdea } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
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

  return (
    <>
      <IconButton dense aria-label={t('v2.ui.button.delete')} aria-haspopup="dialog" onClick={handleClick}>
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
            <Button text onClick={() => setOpen(false)} disabled={pending} data-testid="delete-idea-cancel">
              {t('actions.cancel')}
            </Button>
            <Button color="error" onClick={handleDelete} disabled={pending} data-testid="delete-idea-confirm">
              {t('actions.delete')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteIdeaButton;
