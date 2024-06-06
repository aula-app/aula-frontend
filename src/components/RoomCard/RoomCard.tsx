import { Box, CardMedia, Link, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { RoomType } from '@/types/RoomTypes';
import AppIcon from '../AppIcon';

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
      <Box
        sx={{
          textDecoration: 'none',
          color: 'inherit'
        }}
        component={Link}
        href={`/room/${room.id}/ideas`}>
        <CardContent>
          <Typography variant="h6" noWrap>
            {capitalize(room.room_name)}
          </Typography>
          <CardMedia
            component="img"
            height="194"
            image={room.id % 2 === 0 ? '/img/aula-room1.png' : '/img/aula-room.png'}
            alt="bg image"
            sx={{ borderRadius: '10px', mt: 1, mb: 2 }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            {displayPhases.map((phase) => (
              <Stack
                key={phase}
                direction="row"
                flex={1}
                alignItems="center"
                justifyContent="space-around"
                p={1}
                mx={.5}
                sx={{
                  bgcolor: phases[phase].color,
                  borderRadius: 999
                }}
              >
                <AppIcon name={phases[phase].icon} />
                {Math.floor(Math.random() * 11)}
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export default RoomCard;
