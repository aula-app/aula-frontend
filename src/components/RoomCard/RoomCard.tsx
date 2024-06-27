import { CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { RoomType } from '@/types/RoomTypes';
import AppIcon from '../AppIcon';
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
      <CardContent>
        <AppLink
          sx={{
            textDecoration: 'none',
            color: 'inherit',
          }}
          to={`/room/${room.id}/phase/0`}
        >
          <Typography variant="h6" noWrap>
            {capitalize(room.room_name)}
          </Typography>
          <CardMedia
            component="img"
            height="194"
            image={room.id % 2 === 0 ? '/img/aula-room1.jpg' : '/img/aula-room.jpg'}
            alt="bg image"
            sx={{ borderRadius: '10px', mt: 1, mb: 2, objectFit: 'contain' }}
          />
        </AppLink>
        <Stack direction="row" justifyContent="space-between">
          {displayPhases.map((phase) => (
            <AppLink
              sx={{
                textDecoration: 'none',
                color: 'inherit',
              }}
              to={`/room/${room.id}/phase/${phase}`}
            >
              <Stack
                key={phase}
                direction="row"
                flex={1}
                alignItems="center"
                justifyContent="space-around"
                p={1}
                mx={0.5}
                sx={{
                  bgcolor: phases[phase].color,
                  borderRadius: 999,
                }}
              >
                <AppIcon name={phases[phase].icon} />
                {Math.floor(Math.random() * 11)}
              </Stack>
            </AppLink>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
