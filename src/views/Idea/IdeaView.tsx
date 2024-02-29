import { Stack } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { localStorageGet } from '@/utils';
import WildIdea from '@/components/WildIdea';

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
    <Stack width="100%" height="100%" overflow="auto" p={2}>
      <WildIdea text={data.content} id={data.id} />
    </Stack>
  );
};

export default IdeaView;
