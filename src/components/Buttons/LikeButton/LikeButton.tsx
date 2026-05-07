import AppIconButton from '@/components/AppIconButton';
import { addCommentLike, getCommentLike, removeCommentLike } from '@/services/comments';
import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { useAppStore } from '@/store';
import { CommentType, IdeaType } from '@/types/Scopes';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  item: IdeaType | CommentType;
  disabled?: boolean;
  onChange?: (delta: number) => void; // Optional callback to update likes count in parent component
}

const LikeButton = forwardRef<HTMLButtonElement, Props>(({ item, disabled, onChange }, ref) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [liked, setLiked] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isIdea = 'room_id' in item;

  const getLikeState = async () => {
    const likeState = await (isIdea ? getIdeaLike(item.hash_id) : getCommentLike(item.id));
    setLiked(likeState);
    setLikeStatus(likeState);
  };

  const updateLikeStatus = (newStatus: boolean) => {
    setLikeStatus(newStatus);
    if (onChange) {
      onChange(Number(newStatus) - Number(liked));
    }
  };

  const toggleLike = async () => {
    updateLikeStatus(!likeStatus);
    setIsPending(true);
    try {
      const response = await (likeStatus
        ? isIdea
          ? removeIdeaLike(item.hash_id)
          : removeCommentLike(item.id)
        : isIdea
          ? addIdeaLike(item.hash_id)
          : addCommentLike(item.id));
      if (response.error) {
        updateLikeStatus(!likeStatus); // Revert like status if API call fails
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.failed'), type: 'error' } });
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    getLikeState();
  }, []);

  return (
    <AppIconButton
      ref={ref}
      icon={likeStatus ? 'heartFull' : 'heart'}
      title={t(`tooltips.${likeStatus ? 'heartFull' : 'heart'}`)}
      onClick={toggleLike}
      disabled={disabled || isPending}
      aria-label={likeStatus ? t('tooltips.heartFull') : t('tooltips.heart')}
      aria-pressed={likeStatus}
    >
      {`${item.sum_likes + Number(likeStatus) - Number(liked)}`}
    </AppIconButton>
  );
});

LikeButton.displayName = 'LikeButton';

export default LikeButton;
