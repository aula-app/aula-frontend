import { CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { RoomType } from '@/types/scopes/RoomTypes';
import AppIcon from '../AppIcon';
import AppLink from '../AppLink';
import PhaseBar from '@/layout/PhaseBar';

interface RoomCardProps {
  room: RoomType;
}

const displayPhases = Object.keys(phases) as Array<keyof typeof phases>;
/**
 * Renders "RoomCard" component
 */
const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <Card sx={{ borderRadius: '25px', aspectRatio: 1, overflow: 'clip' }} variant="outlined">
      <Stack>
      <CardContent sx={{flex: 1}}>
        <AppLink
          sx={{
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={`/room/${room.id}/phase/0`}
        >
          <Stack>
          <Typography variant="h6" noWrap>
            {capitalize(room.room_name)}
          </Typography>
          <CardMedia
            component="img"
            image={room.id % 2 === 0 ? '/img/aula-room1.jpg' : '/img/aula-room.jpg'}
            alt="bg image"
            sx={{ borderRadius: '10px', mt: 1, mb: 2, objectFit: 'contain', flex: 1 }}
          />
          </Stack>
        </AppLink>
      </CardContent>
      <PhaseBar room={room.id} />
      </Stack>
    </Card>
  );
};

export default RoomCard;
