import AppIconButton from '@/components/AppIconButton';
import { addCommentLike, getCommentLike, removeCommentLike } from '@/services/comments';
import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { CommentType, IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useEffect, useState } from 'react';

interface Props {
  item: IdeaType | CommentType;
  disabled?: boolean;
}

const LikeButton: React.FC<Props> = ({ item, disabled }) => {
  const [liked, setLiked] = useState(false);

  const isIdea = 'room_id' in item;

  const getLikeState = async () => {
    const likeState = await (isIdea ? getIdeaLike(item.hash_id) : getCommentLike(item.id));
    setLiked(likeState);
  };

  const toggleLike = async () => {
    if (liked) {
      await (isIdea ? removeIdeaLike(item.hash_id) : removeCommentLike(item.id));
    } else {
      await (isIdea ? addIdeaLike(item.hash_id) : addCommentLike(item.id));
    }
    getLikeState();
  };

  useEffect(() => {
    getLikeState();
  }, []);

  return (
    <AppIconButton
      icon={liked ? 'heartFull' : 'heart'}
      onClick={toggleLike}
      disabled={disabled || !checkPermissions(20)}
    >
      {item.sum_likes}
    </AppIconButton>
  );
};

export default LikeButton;
