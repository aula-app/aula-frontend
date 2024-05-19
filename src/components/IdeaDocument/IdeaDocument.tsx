import { Button, Chip, IconButton, Stack, Typography } from '@mui/material';
import { IdeaType } from '@/types/IdeaTypes';
import AppIcon from '../AppIcon';
import ChatBubble from '../ChatBubble';
import { blue } from '@mui/material/colors';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';

interface Props {
  idea: IdeaType;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

export const IdeaDocument = ({ idea, onReload }: Props) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [liked, setLiked] = useState(false);
  const displayDate = new Date(idea.created);

  const manageLike = (likeMethod: likeMethodType) => {
    return databaseRequest('model', {
      model: 'Idea',
      method: likeMethod,
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: idea.id,
      },
      decrypt: [],
    });
  };

  const hasLiked = async () => await manageLike('getLikeStatus').then((result) => setLiked(Boolean(result.data)));
  const addLike = async () => await manageLike(`IdeaAddLike`).then(() => onReload());
  const removeLike = async () => await manageLike(`IdeaRemoveLike`).then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  useEffect(() => {
    hasLiked();
  }, []);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <Typography variant="h6">Title</Typography>
      <Typography mb={2}>{idea.content}</Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={2}>
        <Chip icon={<AppIcon name="settings" />} label="category" color="warning" />
        <Button color="error" size="small" onClick={toggleLike}>
          <AppIcon name={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {idea.sum_likes}
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <AppIcon name="account" size="xl" />
        <Stack maxWidth="100%" overflow="hidden" ml={1} mr="auto">
          {displayDate && (
            <Typography variant="caption" lineHeight={1.5}>
              {displayDate.getFullYear()}/{displayDate.getMonth()}/{displayDate.getDate()}
            </Typography>
          )}
          <Typography
            variant="overline"
            overflow="hidden"
            textOverflow="ellipsis"
            fontWeight={700}
            lineHeight={1.5}
            maxWidth="100%"
          >
            {idea.displayname}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IdeaDocument;
