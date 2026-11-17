import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Dialog from '@/v2/components/ui/Dialog';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ArchiveButtonProps {
  /** Appended to the accessible name. */
  subject?: string;
  size?: string;
  /** Renders a text button with the label beside the icon instead of an icon-only one. */
  labelled?: boolean;
  /** Body of the confirmation dialog, e.g. where archived items can be restored. */
  confirmDescription: string;
  /** Performs the archiving. Resolve with a response carrying `error` to surface a toast. */
  onArchive: () => Promise<{ error?: string | null }>;
  /** Toast shown once archived. */
  successMessage: string;
  /** Called after a successful archive. */
  onArchived?: () => void;
  className?: string;
  'data-testid'?: string;
}

const ArchiveButton = ({
  subject,
  confirmDescription,
  onArchive,
  successMessage,
  onArchived,
  className,
  size = '1.5em',
  labelled = false,
  'data-testid': dataTestId,
}: ArchiveButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const label = t('v2.ui.button.archive');

  const handleArchive = async () => {
    setPending(true);
    try {
      const response = await onArchive();
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(successMessage);
      setOpen(false);
      onArchived?.();
    } catch {
      toast.error(t('errors.failed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {labelled ? (
        <Button
          outlined
          color="secondary"
          aria-haspopup="dialog"
          disabled={pending}
          onClick={() => setOpen(true)}
          className={className}
          data-testid={dataTestId}
        >
          <Icon type="archive" size={size} />
          {label}
        </Button>
      ) : (
        <IconButton
          aria-label={subject ? `${label}: ${subject}` : label}
          aria-haspopup="dialog"
          hint={label}
          disabled={pending}
          onClick={() => setOpen(true)}
          className={className}
          data-testid={dataTestId}
        >
          <Icon type="archive" size={size} />
        </IconButton>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} role="alertdialog" title={t('v2.ui.dialog.archive.title')}>
        <div className="flex flex-col gap-4 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Icon type="archive" size="1.2em" aria-hidden="true" /> {t('v2.ui.dialog.archive.title')}
          </h3>
          <div className="flex flex-col gap-2">
            {confirmDescription.split('\n').map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button text onClick={() => setOpen(false)} disabled={pending} data-testid={TEST_IDS.ARCHIVE_CANCEL}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleArchive} disabled={pending} data-testid={TEST_IDS.ARCHIVE_CONFIRM}>
              {label}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ArchiveButton;
