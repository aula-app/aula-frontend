import Button from '@/v2/components/button/Button';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RestoreButtonProps {
  /** Appended to the accessible name. */
  subject?: string;
  size?: string;
  /** Renders a text button with the label beside the icon instead of an icon-only one. */
  labelled?: boolean;
  /** Performs the restore. Resolve with a response carrying `error` to surface a toast. */
  onRestore: () => Promise<{ error?: string | null }>;
  /** Toast shown once restored. */
  successMessage: string;
  /** Called after a successful restore. */
  onRestored?: () => void;
  className?: string;
  'data-testid'?: string;
}

/** Brings an archived item back. */
const RestoreButton = ({
  subject,
  onRestore,
  successMessage,
  onRestored,
  className,
  size = '1.5em',
  labelled = false,
  'data-testid': dataTestId,
}: RestoreButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const label = t('v2.ui.button.unarchive');

  const handleClick = async () => {
    setPending(true);
    try {
      const response = await onRestore();
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(successMessage);
      onRestored?.();
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
        <Icon type="unarchive" size={size} />
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
      <Icon type="unarchive" size={size} />
    </IconButton>
  );
};

export default RestoreButton;
