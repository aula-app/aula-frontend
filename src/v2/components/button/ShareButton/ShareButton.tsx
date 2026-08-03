import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

interface ShareButtonProps {
  /** App path to copy; resolved against the router basename via `useHref`. */
  path: string;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
}

const ShareButton = ({ path, onOpen }: ShareButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  // useHref resolves the router basename, which window.location-based paths would drop.
  const href = useHref(path);

  const handleClick = async () => {
    onOpen?.();
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).toString());
      toast.success(t('clipboard.linkCopied'));
    } catch {
      toast.error(t('clipboard.linkCopyFailed'));
    }
  };

  return (
    <IconButton aria-label={t('v2.ui.button.share')} data-testid={TEST_IDS.SHARE_BUTTON} onClick={handleClick}>
      <Icon type="share" />
    </IconButton>
  );
};

export default ShareButton;
