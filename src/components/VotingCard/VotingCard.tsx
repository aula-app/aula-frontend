import { Button, Card, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { GroupAdd } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Vote, votingOptions } from '@/utils/voting';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { databaseRequest } from '@/utils/requests';

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

  const getVote = async () => await databaseRequest('model', {
      model: 'Idea',
      method: 'getVoteValue',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: params['idea_id'],
      },
      decrypt: [],
    })
    .then(response => setVote(response.data));

    const registerVote = async (vote: number) => await databaseRequest('model', {
      model: 'Idea',
      method: 'voteForIdea',
      arguments: {
        user_id: jwt_payload.user_id,
        idea_id: params['idea_id'],
        vote_value: vote - 1, //turn 0, 1, 2 to -1, 0 , 1
      },
      decrypt: [],
    }).then(() => getVote())

    useEffect(() => {
      getVote()
    }, [])

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        overflow: 'unset',
        scrollSnapAlign: 'center',
        bgcolor: votingOptions[vote + 1]['bg'],
        color: votingOptions[vote + 1]['color'],
        borderRadius: 0
      }}
    >
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
              color: 'inherit',
              backgroundColor: votingOptions[vote + 1][`button`],
              borderRadius: 8,
            }}
            key={i}
            onClick={() => registerVote(i as Vote)}
          >
            <Stack alignItems="center">
              <Typography fontSize={75}>{ option['icon']  }</Typography>
              { option['label'] }
            </Stack>
          </Button>
        ))}
      </Stack>
    </Card>
  );
};

export default VotingCard;
