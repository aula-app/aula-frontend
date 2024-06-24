import { Button, Card, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { GroupAdd } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { databaseRequest, localStorageGet, parseJwt, Vote, noVoteOptions, votingOptions } from '@/utils';


/**
 * Renders "VotingCards" component
 * url: /
 */
const VotingCard = () => {
  //const CurrentIcon = phases.wild.icon;
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [vote, setVote] = useState<Vote>(0);
  const [hasVoted, setHasVoted] = useState<Boolean>(false);

  const getVote = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getVoteValue',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: params['idea_id'],
      },
    }).then((response) => {
      setVote(response.data);
      setHasVoted(response.count > 0);
    });

  const registerVote = async (vote: number) =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'voteForIdea',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: params['idea_id'],
        vote_value: vote - 1, //turn 0, 1, 2 to -1, 0 , 1
      },
    }).then(() => getVote());

  useEffect(() => {
    getVote();
  }, []);

  return (
    <Stack p={2}>
      <Stack direction="row">
        <Typography variant="h6">Vote</Typography>
        <Button size="small" sx={{ ml: 'auto', px: 1, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}>
          <Typography variant="caption">or</Typography>
          <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
            DELEGATE VOTE
          </Typography>
          <GroupAdd fontSize="small" />
        </Button>
      </Stack>
      <Stack direction="row-reverse" justifyContent="space-around" py={2}>
        {votingOptions.map((option, i) => (
          <Button
            sx={{
              color: vote + 1 === i && hasVoted ? option['color'] : noVoteOptions['color'],
              backgroundColor: vote + 1 === i && hasVoted ? option[`button`] : noVoteOptions['button'],
              borderRadius: 8,
            }}
            key={i}
            onClick={() => registerVote(i as Vote)}
          >
            <Stack alignItems="center">
              <Typography fontSize={75}>{option['icon']}</Typography>
              {option['label']}
            </Stack>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default VotingCard;
