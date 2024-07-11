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
    <Card sx={{ borderRadius: '25px', aspectRatio: 1 }} variant="outlined">
        <Stack height="100%">
          <AppLink
            component={Stack}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              flex: 1,
              p: 2
            }}
            to={`/room/${room.id}/phase/0`}
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
          </AppLink>
          <PhaseBar room={room.id} />
        </Stack>
    </Card>
  );
};

export default RoomCard;
