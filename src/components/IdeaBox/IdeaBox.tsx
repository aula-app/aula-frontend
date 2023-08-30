import { Box, CardMedia, Chip, Stack, Typography } from '@mui/material';
import { Card, CardContent, Grid } from '@mui/material';
import { AppLink } from '..';
import { useEffect, useState } from 'react';
import { PhaseButton } from '../PhaseButton';
import phases from '../../utils/phases';

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if (displayPhases.includes('success')) displayPhases.splice(displayPhases.indexOf('success'), 1);
if (displayPhases.includes('reject')) displayPhases.splice(displayPhases.indexOf('reject'), 1);
if (displayPhases.includes('wild')) displayPhases.splice(displayPhases.indexOf('wild'), 1);
/**
 * Renders "Welcome" view
 * url: /
 */
const IdeaBox = () => {
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

  const CurrentIcon = phases.wild.icon;

  return (
    <AppLink>
      <Card sx={{ borderRadius: '25px' }} variant="outlined">
        <CardContent>
          <Stack direction="row" mb={2} alignItems="center" spacing={2}>
            {displayPhases.map((phase, i) => (
              <Stack
                width={i === 0 ? 'auto' : '1.5em'}
                flexGrow={i === 0 ? 1 : 0}
                height="1.5rem"
                borderRadius={999}
                bgcolor={phases[phase].color}
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption">{i === 0 ? phases[phase].name : ''}</Typography>
              </Stack>
            ))}
          </Stack>
          <CardMedia
            component="img"
            height="194"
            image="/img/aula-room.png"
            alt="bg image"
            sx={{ borderRadius: '10px' }}
          />
          <Stack direction="row" mt={3} alignItems="center">
            <CurrentIcon />
            <Typography>3</Typography>
            <Stack flexGrow={1} pr={1} direction="row" alignItems="center" justifyContent="flex-end">
              <Chip label="category" color="warning" />
            </Stack>
          </Stack>
          <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
            Room Name
          </Typography>
          <Typography sx={{ mt: 0.5, mb: -1 }} variant="body2" noWrap>
            description
          </Typography>
        </CardContent>
      </Card>
    </AppLink>
  );
};

export default IdeaBox;
