import { Button, Chip, Stack, Typography } from '@mui/material';
import { IdeaType } from '@/types/Scopes';
import AppIcon from '../AppIcon';
import { databaseRequest, phases } from '@/utils';
import { useEffect, useState } from 'react';
import MoreOptions from '../MoreOptions';

interface Props {
  idea: IdeaType;
  disabled?: boolean;
  onReload: () => void;
}

type likeMethodType = 'getLikeStatus' | 'IdeaAddLike' | 'IdeaRemoveLike';

export const IdeaDocument = ({ idea, disabled = false, onReload }: Props) => {
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
    <Stack width="100%" sx={{ scrollSnapAlign: 'center' }} color="secondary" mb={2}>
      <Stack direction="row" justifyContent="space-between">
        <Chip icon={<AppIcon icon="settings" />} label="category" variant="outlined" />
        <MoreOptions scope="ideas" id={idea.id} onClose={onReload} />
      </Stack>
      <Stack p={2} bgcolor={phases['0'].baseColor[50]} borderRadius={3} mb={1}>
        <Typography variant="h6">{idea.title}</Typography>
        <Typography mb={2}>{idea.content}</Typography>
      </Stack>
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
        <Button color="error" size="small" onClick={toggleLike} disabled={disabled}>
          <AppIcon icon={liked ? 'heartfull' : 'heart'} />
          {idea.sum_likes}
        </Button>
      </Stack>
    </Stack>
  );
};

export default IdeaDocument;
