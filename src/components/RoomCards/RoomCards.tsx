import { CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent, Grid } from '@mui/material';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';
import { PhaseButton } from '../PhaseButton';
import phases from '../../utils/phases';

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if(displayPhases.includes('success')) displayPhases.splice(displayPhases.indexOf('success'), 1);
if(displayPhases.includes('reject')) displayPhases.splice(displayPhases.indexOf('reject'), 1);
if(displayPhases.includes('wild')) displayPhases.splice(displayPhases.indexOf('wild'), 1);
/**
 * Renders "Welcome" view
 * url: /
 */
const RoomCards = () => {
  const [data, setData] = useState([] as any[]);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (await fetch(process.env.REACT_APP_API_URL + '/api/controllers/rooms.php')).json();

      // set state when the data received
      console.log(data);
      setData(data.data);
    };

    dataFetch();
  }, []);

  return (
    <Grid container spacing={1}>
      {data.map((d, i) => (
        <Grid key={d.id} item xs={12} md={4}>
          <AppLink to={`/room/${d.id}`}>
            <Card sx={{ borderRadius: '25px' }} variant="outlined">
              <CardContent>
                <CardMedia
                  component="img"
                  height="194"
                  image={i % 2 === 0 ? '/img/aula-room1.png' : '/img/aula-room.png'}
                  alt="bg image"
                  sx={{ borderRadius: '10px' }}
                />
                <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
                  {capitalize(d.room_name)}
                </Typography>
                <Typography sx={{ mt: 0.5, mb: -1 }} variant="body2" noWrap>
                  {d.description_public}
                </Typography>
                <Stack mt={3}>
                  <PhaseButton variant='wild' />
                </Stack>
                <Grid container spacing={1} my={0}>
                  {displayPhases.map(phase => (
                    <Grid item xs={3}>
                      <PhaseButton variant={phase} noText />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </AppLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default RoomCards;
