import { CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent, Grid } from '@mui/material';
import { AppLink } from '@/components';
import { useEffect, useState } from 'react';
import { PhaseButton } from '../PhaseButton';
import phases from '@/utils/phases';
import { RoomType } from '@/types/RoomTypes';

interface RoomCardProps {
  room: RoomType;
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
if (displayPhases.includes('success')) displayPhases.splice(displayPhases.indexOf('success'), 1);
if (displayPhases.includes('reject')) displayPhases.splice(displayPhases.indexOf('reject'), 1);
if (displayPhases.includes('wild')) displayPhases.splice(displayPhases.indexOf('wild'), 1);
/**
 * Renders "RoomCard" component
 */
const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Card sx={{ borderRadius: '25px' }} variant="outlined">
      <CardContent>
        <CardMedia
          component="img"
          height="194"
          image={room.id % 2 === 0 ? '/img/aula-room1.png' : '/img/aula-room.png'}
          alt="bg image"
          sx={{ borderRadius: '10px' }}
        />
        <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
          {capitalize(room.room_name)}
        </Typography>
        <Typography sx={{ mt: 0.5, mb: -1 }} variant="body2" noWrap>
          {room.description_public}
        </Typography>
        <Stack mt={3} className="noPrint">
          <PhaseButton variant="wild" />
        </Stack>
        <Grid container spacing={1} my={0} className="noPrint">
          {displayPhases.map(phase => (
            <Grid item xs={3} key={phase}>
              <PhaseButton variant={phase} noText />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
