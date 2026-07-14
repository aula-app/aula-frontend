import { IdeaType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useToast } from '@/v2/hooks';
import { TEST_IDS } from '@/test-ids';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';

interface ShareIdeaButtonProps {
  idea: IdeaType;
  /** Notify the parent that the action fired (e.g. to close a menu). */
  onOpen?: () => void;
}

const ShareIdeaButton = ({ idea, onOpen }: ShareIdeaButtonProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { phase } = useParams<{ phase: `${RoomPhases}` }>();
  // useHref resolves the router basename, which window.location-based paths would drop.
  const href = useHref(`/room/${idea.room_hash_id}/phase/${phase || '0'}/idea/${idea.hash_id}`);

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

export default ShareIdeaButton;
