import AppIconButton from '@/components/AppIconButton';
import { addCommentLike, getCommentLike, removeCommentLike } from '@/services/comments';
import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { CommentType, IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  item: IdeaType | CommentType;
  disabled?: boolean;
}

const LikeButton: React.FC<Props> = ({ item, disabled }) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);

  const isIdea = 'room_id' in item;

  const getLikeState = async () => {
    const likeState = await (isIdea ? getIdeaLike(item.hash_id) : getCommentLike(item.id));
    setLiked(likeState);
    setLikeStatus(likeState);
  };

  const toggleLike = async () => {
    if (likeStatus) {
      await (isIdea ? removeIdeaLike(item.hash_id) : removeCommentLike(item.id));
    } else {
      await (isIdea ? addIdeaLike(item.hash_id) : addCommentLike(item.id));
    }
    setLikeStatus(!likeStatus);
  };

  useEffect(() => {
    getLikeState();
  }, []);

  // Calculate the total number of likes for display and screen readers
  const totalLikes = item.sum_likes + Number(likeStatus) - Number(liked);

  // Prepare translated labels for accessibility
  const itemType = isIdea ? 'idea' : 'comment';
  const likeActionLabel = likeStatus
    ? t('accessibility.aria.unlikeItem', { item: t(`scopes.${itemType}.name`) })
    : t('accessibility.aria.likeItem', { item: t(`scopes.${itemType}.name`) });
  const likesCountLabel = t('accessibility.aria.likesCount', { count: totalLikes });

  return (
    <AppIconButton
      icon={likeStatus ? 'heartFull' : 'heart'}
      onClick={toggleLike}
      disabled={disabled || !checkPermissions('ideas', 'like')}
      aria-label={likeActionLabel}
      aria-pressed={likeStatus}
      title={likeActionLabel}
    >
      <span aria-live="polite" aria-atomic="true">
        {`${totalLikes}`}
      </span>
    </AppIconButton>
  );
};

export default LikeButton;
