import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import { AppLink } from '@/components';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';


/**
 * Renders "Idea" view
 * url: /
 */
const IdeaView = () => {
  const routeParams = useParams();
  const [data, setData] = useState([] as any[]);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/idea.php",
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                  {
                    'id': routeParams.idea_id
                  })
              })).json();

      // set state when the data received
      console.log(data)
      setData(data)
    };

    dataFetch();
    },[routeParams.idea_id]);


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
