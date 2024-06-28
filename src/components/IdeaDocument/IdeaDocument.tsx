import { Button, Chip, Stack, Typography } from '@mui/material';
import { IdeaType } from '@/types/IdeaTypes';
import AppIcon from '../AppIcon';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { useEffect, useState } from 'react';
import MoreOptions from '../MoreOptions';
import { grey } from '@mui/material/colors';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

export const IdeaDocument = ({ idea, disabled = false, onReload }: Props) => {
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
    <Stack width="100%" sx={{ scrollSnapAlign: 'center'}} color="secondary" mb={2}>
      <Stack direction="row" justifyContent="space-between">
        <Chip icon={<AppIcon name="settings" />} label="category" color="warning" />
        <MoreOptions />
      </Stack>
      <Stack p={2} bgcolor={grey[200]} borderRadius={3} my={1}>
        <Typography variant="h6">{idea.title}</Typography>
        <Typography mb={2}>{idea.content}</Typography>
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
        <Button color="error" size="small" onClick={toggleLike} disabled={disabled}>
          <AppIcon name={liked ? 'heartfull' : 'heart'} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaDocument;
