import PhaseBar from '@/layout/PhaseBar';
import { RoomType } from '@/types/Scopes';
import { Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FC } from 'react';
import AppLink from '../AppLink';
import DefaultImage from '../DefaultImages';

interface RoomCardProps {
  room: RoomType;
  className?: string;
}

/**
 * Parses the description_internal field to determine if it's a default image
 * @param description - The description_internal string from the room
 */
const parseDescription = (description: string) => {
  if (!description || !description.startsWith('DI:')) {
    return { isDefaultImage: false, imageNumber: 0, imageShift: 0 };
  }

  const [, imageNum = '0', shift = '0'] = description.split(':');
  return {
    isDefaultImage: true,
    imageNumber: Number(imageNum) || 0,
    imageShift: Number(shift) || 0,
  };
};

/**
 * Renders a card component displaying room information
 * @param room - The room object containing details to display
 * @param className - Optional CSS class name
 */
const RoomCard: FC<RoomCardProps> = ({ room, className }) => {
  const { imageNumber, imageShift } = parseDescription(room.description_internal);

  return (
    <Grid
      size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
      className={className}
      sx={{ scrollSnapAlign: 'center', order: -room.type }}
    >
      <Card sx={{ borderRadius: '25px', width: '100%' }} variant="outlined">
        <AppLink to={`/room/${room.hash_id}/phase/0`}>
          <Stack
            sx={{
              flex: 1,
              p: 2,
            }}
          >
            <Typography variant="h3" noWrap title={room.room_name}>
              {room.room_name || 'AULA'}
            </Typography>
            <DefaultImage image={imageNumber || 0} shift={imageShift || 0} />
          </Stack>
        </AppLink>
        <PhaseBar room={room.hash_id} />
      </Card>
    </Grid>
  );
};

export default RoomCard;
