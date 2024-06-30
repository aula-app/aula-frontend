import { Button, Chip, Stack, Typography } from '@mui/material';
import { IdeaType } from '@/types/scopes/IdeaTypes';
import AppIcon from '../AppIcon';
import ChatBubble from '../ChatBubble';
import { blue } from '@mui/material/colors';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { useEffect, useState } from 'react';
import AppLink from '../AppLink';
import MoreOptions from '../MoreOptions';

interface Props {
  idea: IdeaType;
  comments?: number;
  to?: string;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

export const IdeaBubble = ({ idea, comments = 0, to, onReload }: Props) => {
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
    });
  };

  const hasLiked = async () => await manageLike('getLikeStatus').then((result) => setLiked(Boolean(result.data)));
  const addLike = async () => await manageLike('IdeaAddLike').then(() => onReload());
  const removeLike = async () => await manageLike('IdeaRemoveLike').then(() => onReload());

  const toggleLike = () => {
    liked ? removeLike() : addLike();
    setLiked(!liked);
  };

  useEffect(() => {
    hasLiked();
  }, []);

  return (
    <Stack width="100%" sx={{ scrollSnapAlign: 'center', mb: 2, mt: 1 }}>
      <ChatBubble color={blue[50]}>
        <Stack>
          <AppLink to={to} disabled={!to}>
            <Stack px={.5}>
              <Typography variant="h6">{idea.title}</Typography>
              <Typography>{idea.content}</Typography>
            </Stack>
          </AppLink>
          <Stack direction="row" justifyContent="space-between" my={1}>
            <Chip icon={<AppIcon name="settings" />} label="category" variant='outlined' />
            <MoreOptions element='ideas' id={idea.id} />
          </Stack>
        </Stack>
      </ChatBubble>
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
        {/* <Chip icon={<AppIcon name="settings" />} label="category" color="warning" /> */}
        {comments > 0 && (
          <Stack direction="row" alignItems="center">
            <AppIcon name="chat" sx={{ mr: 0.5 }} />
            {comments}
          </Stack>
        )}
        <Button color="error" size="small" onClick={toggleLike}>
          <AppIcon name={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
