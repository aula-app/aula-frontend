import PhaseBar from '@/layout/PhaseBar';
import { RoomType } from '@/types/Scopes';
import { phases } from '@/utils';
import { Card, CardMedia, Stack, Typography, capitalize } from '@mui/material';
import AppLink from '../AppLink';
import DefaultImage from '../DefaultImages';

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
          {room.description_internal.substring(0, 3) === 'DI:' ? (
            <DefaultImage
              image={Number(room.description_internal.split(':')[1])}
              shift={Number(room.description_internal.split(':')[2])}
            />
          ) : (
            <CardMedia
              component="img"
              image={room.description_internal}
              alt="bg image"
              sx={{ borderRadius: '10px', objectFit: 'cover', flex: 1, aspectRatio: '16/9' }}
            />
          )}
        </Stack>
      </AppLink>
      <PhaseBar room={room.id} />
    </Card>
  );
};

export default RoomCard;
