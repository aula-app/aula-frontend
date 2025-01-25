import AppIcon from '@/components/AppIcon';
import { addLike, getLike, removeLike } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Button } from '@mui/material';
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
    (await liked) ? removeLike(idea.hash_id) : addLike(idea.hash_id);
    getLikeState();
  };

  useEffect(() => {
    getLikeState();
  }, [idea]);

  return (
    <Button color="error" size="small" onClick={toggleLike} disabled={!checkPermissions(20)}>
      <AppIcon icon={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
      {idea.sum_likes}
    </Button>
  );
};

export default LikeButton;
