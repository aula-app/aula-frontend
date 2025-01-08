import PhaseBar from '@/layout/PhaseBar';
import { RoomType } from '@/types/Scopes';
import { Card, CardMedia, Stack, Typography, capitalize } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AppLink from '../AppLink';
import DefaultImage from '../DefaultImages';

interface RoomCardProps {
  room: RoomType;
}

/**
 * Renders "RoomCard" component
 */
const RoomCard = ({ room, ...restOfProps }: RoomCardProps) => {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center', order: -room.type }} {...restOfProps}>
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
            {room.description_internal && room.description_internal.substring(0, 3) === 'DI:' ? (
              <DefaultImage
                image={Number(room.description_internal.split(':')[1] || 0)}
                shift={Number(room.description_internal.split(':')[2] || 0)}
              />
            ) : (
              <CardMedia
                component="img"
                image={room.description_internal}
                alt="bg image"
                sx={{ borderRadius: '10px', objectFit: 'cover', flex: 1, aspectRatio: '1.33', width: '100%' }}
              />
            )}
          </Stack>
        </AppLink>
        <PhaseBar room={room.id} />
      </Card>
    </Grid>
  );
};

export default RoomCard;
