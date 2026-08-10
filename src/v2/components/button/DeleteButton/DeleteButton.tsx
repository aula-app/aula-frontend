import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteButtonProps {
  /** Localized scope name interpolated into the dialog copy, e.g. `t('scopes.boxes.name')`. */
  scopeLabel: string;
  /** Title of the item being deleted, surfaced in the dialog body. */
  subject?: string;
  /** Performs the deletion. Resolve with a response carrying `error` to surface a toast. */
  onConfirm: () => Promise<{ error?: string | null }>;
  /** Called after a successful deletion (e.g. to refetch the list). */
  onDeleted?: () => void;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
  /** Hide the button entirely, e.g. when the permission check fails. */
  hidden?: boolean;
  confirmTestId?: string;
  cancelTestId?: string;
}

const DeleteButton = ({
  scopeLabel,
  subject,
  onConfirm,
  onDeleted,
  onOpen,
  hidden = false,
  confirmTestId,
  cancelTestId,
}: DeleteButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const response = await onConfirm();
      if (response.error) {
        toast.error(response.error || t('errors.failed'));
        return;
      }
      toast.success(t('ui.accessibility.itemsDeleted', { count: 1, type: scopeLabel }));
      setOpen(false);
      onDeleted?.();
    } finally {
      setPending(false);
    }
  };

  const handleClick = () => {
    onOpen?.();
    setOpen(true);
  };

  if (hidden) return null;

  return (
    <>
      <IconButton
        aria-label={t('v2.ui.button.delete')}
        hint={t('v2.ui.button.delete')}
        aria-haspopup="dialog"
        data-testid={TEST_IDS.DELETE_BUTTON}
        onClick={handleClick}
      >
        <Icon type="delete" />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        role="alertdialog"
        title={t('deletion.headline', { var: scopeLabel })}
      >
        <div className="flex flex-col gap-4 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-error-fg">
            <Icon type="alert" size="1.2em" /> {t('v2.ui.dialog.delete.title', { var: scopeLabel })}
          </h3>
          <p className="whitespace-pre-line">
            {subject
              ? t('v2.ui.dialog.delete.descriptionNamed', { var: subject })
              : t('v2.ui.dialog.delete.description', { var: scopeLabel })}
          </p>
          <div className="flex justify-end gap-2">
            <Button text onClick={() => setOpen(false)} disabled={pending} data-testid={cancelTestId}>
              {t('actions.cancel')}
            </Button>
            <Button color="error" onClick={handleDelete} disabled={pending} data-testid={confirmTestId}>
              {t('actions.delete')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteButton;
