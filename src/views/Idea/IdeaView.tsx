import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';


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
    <Grid container spacing={4}>
       {data.map((d,i) =>
      <Grid item xs={12} md={4}>

      <AppLink to={ `/room/${ d.id }`} >
        <Card>
          <CardHeader title={d.room_name}/>
          <CardContent>
            <img 
              alt={'image number ' + i}
              src={ (i % 2 === 0) ? '/img/aula.png':'img/aula-room.png' }
              />
            {d.description_public}
          </CardContent>
        </Card>

        </AppLink>
        </Grid>
        )
        }
    </Grid>
  );
};

export default IdeaView;
