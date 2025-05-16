import PhaseBar from '@/layout/PhaseBar';
import { RoomType } from '@/types/Scopes';
import { withKeyboardSupport } from '@/utils/accessibility';
import { Card, CardMedia, Stack, Typography, capitalize } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
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
const RoomCard = ({ room, className }: RoomCardProps) => {
  const { t } = useTranslation();
  const { imageNumber, imageShift } = parseDescription(room.description_internal);
  const roomUrl = `/room/${room.hash_id}/phase/0`;

  // Handle keyboard navigation
  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = roomUrl;
    }
  };

  return (
    <Grid
      size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
      className={className}
      sx={{ scrollSnapAlign: 'center', order: -room.type }}
    >
      <Card 
        sx={{ borderRadius: '25px', width: '100%' }} 
        variant="outlined"
        tabIndex={0}
        role="link"
        aria-label={t('actions.enter_room', { name: room.room_name || 'AULA' })}
        onKeyDown={handleCardKeyDown}
      >
        <AppLink 
          to={roomUrl}
          aria-labelledby={`room-title-${room.hash_id}`}
        >
          <Stack
            sx={{
              flex: 1,
              p: 2,
            }}
          >
            <Typography 
              variant="h3" 
              noWrap 
              title={room.room_name}
              id={`room-title-${room.hash_id}`}
            >
              {room.room_name || 'AULA'}
            </Typography>
            {/* {isDefaultImage ? ( */}
            <DefaultImage 
              image={imageNumber || 0} 
              shift={imageShift || 0} 
              aria-hidden={true}
            />
            {/* ) : (
              <CardMedia
                component="img"
                image={room.description_internal}
                alt={`${room.room_name} background`}
                sx={{ borderRadius: '10px', objectFit: 'cover', flex: 1, aspectRatio: '1.33', width: '100%' }}
              />
            )} */}
          </Stack>
        </AppLink>
        <PhaseBar room={room.hash_id} />
      </Card>
    </Grid>
  );
};

export default RoomCard;
