import { CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent, Grid } from '@mui/material';
import { phases } from '@/utils/phases';
import { RoomType } from '@/types/RoomTypes';
import AppIcon from '../AppIcon';

interface RoomCardProps {
  room: RoomType;
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
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
        <Stack direction="row" justifyContent="space-between" mt={1} className="noPrint" sx={{borderRadius: 999, overflow: 'clip'}}>
          {displayPhases.map(phase => (
            <Stack direction="row" flex={1} alignItems="center" justifyContent="space-around" py={1} sx={{bgcolor: phases[phase].color}}>
              <AppIcon name={phases[phase].icon} />
              {Math.floor(Math.random()*11)}
            </Stack>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
};

export default RoomCard;
