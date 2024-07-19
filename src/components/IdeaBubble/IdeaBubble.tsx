import { IdeaType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Chip, Stack, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';
import ChatBubble from '../ChatBubble';
import MoreOptions from '../MoreOptions';

interface Props {
  idea: IdeaType;
  comments?: number;
  to?: string;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

export const IdeaBubble = ({ idea, comments = 0, to, onReload }: Props) => {
  const [liked, setLiked] = useState(false);
  const displayDate = new Date(idea.created);

  const manageLike = (likeMethod: likeMethodType) => {
    return databaseRequest(
      {
        model: 'Idea',
        method: likeMethod,
        arguments: {
          idea_id: idea.id,
        },
      },
      ['user_id']
    );
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
            <Stack px={0.5}>
              <Typography variant="h6">{idea.title}</Typography>
              <Typography>{idea.content}</Typography>
            </Stack>
          </AppLink>
          <Stack direction="row" justifyContent="space-between" my={1}>
            <Chip icon={<AppIcon icon="settings" />} label="category" variant="outlined" />
            <MoreOptions scope="ideas" id={idea.id} onClose={onReload} />
          </Stack>
        </Stack>
      </ChatBubble>
      <Stack direction="row" alignItems="center">
        <AppIcon icon="account" size="xl" />
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
        {/* <Chip icon={<AppIcon icon="settings" />} label="category" color="warning" /> */}
        {comments > 0 && (
          <Stack direction="row" alignItems="center">
            <AppIcon icon="chat" sx={{ mr: 0.5 }} />
            {comments}
          </Stack>
        )}
        <Button color="error" size="small" onClick={toggleLike}>
          <AppIcon icon={liked ? 'heartfull' : 'heart'} sx={{ mr: 0.5 }} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaBubble;
