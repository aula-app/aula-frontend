import { Stack, Typography } from '@mui/material';
import { Card } from '@mui/material';
import { AppLink } from '..';
import { databaseRequest, localStorageGet, parseJwt, phases, variantOptions} from '@/utils';
import { useParams } from 'react-router-dom';
import { IdeaType } from '@/types/IdeaTypes';
import { useEffect, useState } from 'react';

interface IdeaCardProps {
  idea: IdeaType;
  phase: number;
}

type variant = 'discussion' | 'approved' | 'dismissed' | 'voting' | 'voted' | 'neutral' | 'rejected';

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
/**
 * Renders "IdeaCard" component
 */
const IdeaCard = ({ idea, phase }: IdeaCardProps) => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [variant, setVariant] = useState<variant>(
    phase === 1 && idea.approved === 1
      ? 'approved'
      : phase === 1 && idea.approved === -1
        ? 'dismissed'
        : phase === 2
          ? 'voting'
          : phase === 3
            ? idea.is_winner
              ? 'voted'
              : 'rejected'
            : 'discussion'
  );

  const getVote = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getVoteValue',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: idea.idea_id,
      },
    }).then((response) => setVote(response.count, response.data));

  const setVote = (hasVoted: number, vote: number) => {
    if (hasVoted > 0) setVariant(vote > 0 ? 'voted' : vote < 0 ? 'rejected' : 'neutral');
  };

  useEffect(() => {
    if (phase === 2) getVote();
  }, []);

  return (
    <Card
      sx={{
        borderRadius: '25px',
        overflow: 'hidden',
        mb: 2,
        scrollSnapAlign: 'center',
        bgcolor: variantOptions[variant].bg,
      }}
      variant="outlined"
    >
      <AppLink to={`/room/${params.room_id}/idea-box/${params.box_id}/idea/${idea.idea_id}`}>
        <Stack direction="row" height={68} alignItems="center" color={variantOptions[variant].color}>
          {variant !== 'discussion' && (
            <Stack
              height="100%"
              alignItems="center"
              justifyContent="center"
              sx={{
                aspectRatio: 1,
                borderRight: '1px solid currentColor'
              }}
              fontSize="40px"
            >
              {/* {variantOptions[variant].icon} */}
            </Stack>
          )}
          <Stack flexGrow={1} px={2} overflow="hidden">
            <Typography variant="body2" noWrap textOverflow="ellipsis">
              {idea.content}
            </Typography>
          </Stack>
        </Stack>
      </AppLink>
    </Card>
  );
};

export default IdeaCard;
