import { databaseRequest, Vote, votingOptions } from '@/utils';
import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppIcon from '../AppIcon';

/**
 * Renders "VotingCards" component
 * url: /
 */
const VotingCard = () => {
  const params = useParams();
  const [vote, setVote] = useState<Vote>(0);
  const [hasVoted, setHasVoted] = useState<Boolean>(false);

  const getVote = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getVoteValue',
        arguments: {
          idea_id: params['idea_id'],
        },
      },
      ['user_id']
    ).then((response) => {
      setVote(response.data);
      setHasVoted(response.count > 0);
    });

  const registerVote = async (vote: number) =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'voteForIdea',
        arguments: {
          idea_id: params['idea_id'],
          vote_value: vote - 1, //turns 0, 1, 2 to -1, 0 , 1
        },
      },
      ['user_id']
    ).then(() => getVote());

  useEffect(() => {
    getVote();
  }, []);

  return (
    <Stack p={2}>
      <Stack direction="row-reverse" justifyContent="space-around" py={2}>
        {votingOptions.map((option, i) => (
          <Button
            sx={{
              color: 'inherit',
              bgcolor: vote + 1 === i && hasVoted ? `${option}.main` : 'transparent',
              borderRadius: 8,
            }}
            key={i}
            onClick={() => registerVote(i as Vote)}
          >
            <Stack alignItems="center" width={70}>
              <AppIcon icon={option} size="full" />
              {option}
            </Stack>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};

export default VotingCard;
