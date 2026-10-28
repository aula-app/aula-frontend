import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ArchiveButtonProps {
  /** Appended to the accessible name. */
  subject?: string;
  size?: string;
  /** Renders a text button with the label beside the icon instead of an icon-only one. */
  labelled?: boolean;
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
  const [pending, setPending] = useState(false);
  const label = t('v2.ui.button.archive');

  const handleClick = async () => {
    setPending(true);
    try {
      const response = await onArchive();
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(successMessage);
      onArchived?.();
    } catch {
      toast.error(t('errors.failed'));
    } finally {
      setPending(false);
    }
  };

  if (labelled) {
    return (
      <Button
        outlined
        color="secondary"
        disabled={pending}
        onClick={handleClick}
        className={className}
        data-testid={dataTestId}
      >
        <Icon type="archive" size={size} />
        {label}
      </Button>
    );
  }

  return (
    <IconButton
      aria-label={subject ? `${label}: ${subject}` : label}
      hint={label}
      disabled={pending}
      onClick={handleClick}
      className={className}
      data-testid={dataTestId}
    >
      <Icon type="archive" size={size} />
    </IconButton>
  );
};

export default ArchiveButton;
