import PhaseBar from '@/layout/PhaseBar';
import { RoomType } from '@/types/Scopes';
import { phases } from '@/utils';
import { Card, CardMedia, Stack, Typography, capitalize } from '@mui/material';
import AppLink from '../AppLink';

interface RoomCardProps {
  room: RoomType;
}

const displayPhases = Object.keys(phases) as Array<keyof typeof phases>;
/**
 * Renders "RoomCard" component
 */
const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Card sx={{ borderRadius: '25px' }} variant="outlined">
      <AppLink to={`/room/${room.id}/phase/0`}>
        <Stack
          sx={{
            flex: 1,
            p: 2,
          }}
        >
          <Typography variant="h6" noWrap>
            {capitalize(room.room_name)}
          </Typography>
          <CardMedia
            component="img"
            image={room.id % 2 === 0 ? '/img/aula-room1.jpg' : '/img/aula-room.jpg'}
            alt="bg image"
            sx={{ borderRadius: '10px', objectFit: 'contain', flex: 1 }}
          />
        </Stack>
      </AppLink>
      <PhaseBar room={room.id} />
    </Card>
  );
};

export default RoomCard;
