import AppIconButton from '@/components/AppIconButton';
import { addLike, getLike, removeLike } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { useEffect, useState } from 'react';

interface Props {
  idea: IdeaType;
}

const LikeButton: React.FC<Props> = ({ idea }) => {
  const [liked, setLiked] = useState(false);

  const getLikeState = async () => {
    const likeState = await getLike(idea.hash_id);
    setLiked(likeState);
  };

  const toggleLike = async () => {
    if (liked) {
      await removeLike(idea.hash_id);
    } else {
      await addLike(idea.hash_id);
    }
    getLikeState();
  };

  useEffect(() => {
    getLikeState();
  }, []);

  return (
    <AppIconButton icon={liked ? 'heartFull' : 'heart'} onClick={toggleLike} disabled={!checkPermissions(20)}>
      {idea.sum_likes}
    </AppIconButton>
  );
};

export default LikeButton;
