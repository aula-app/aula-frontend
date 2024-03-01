import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { localStorageGet } from '@/utils';
import WildIdea from '@/components/WildIdea';
import IdeaComment from '@/components/IdeaComment';
import ApprovalCard from '@/components/ApprovalCard';
import VotingCard from '@/components/VotingCard';
import VotingResults from '@/components/VotingResults';

/**
 * Renders "Idea" view
 * url: /
 */
const IdeaView = () => {
  const params = useParams();
  const jwt_token = localStorageGet('token');
  const [data, setData] = useState({} as { [key: string]: string });

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/idea.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
          body: JSON.stringify({
            idea_id: params['ideaId'],
          }),
        })
      ).json();

      // set state when the data received
      console.log(data);
      setData(data);
    };

    dataFetch();
  }, [params.ideaId]);

  return (
    <Stack width="100%" height="100%" overflow="auto">
      <VotingCard />
      <Stack p={2}>
        <VotingResults yourVote='against' />
        <WildIdea text={data.content} />
        <ApprovalCard disabled />
        <Typography variant="h5" py={2}>
          3 Comments
        </Typography>
        <IdeaComment text="lalala" id="X" />
      </Stack>
    </Stack>
  );
};

export default IdeaView;
