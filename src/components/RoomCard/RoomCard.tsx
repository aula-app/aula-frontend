import { BottomNavigation, BottomNavigationAction, CardMedia, Stack, Typography, capitalize } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { phases } from '@/utils';
import { RoomType } from '@/types/RoomTypes';
import AppIcon from '../AppIcon';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';

interface RoomCardProps {
  room: RoomType;
}

const displayPhases = Object.keys(Object.freeze(phases)) as Array<keyof typeof phases>;
/**
 * Renders "RoomCard" component
 */
const RoomCard = ({ room }: RoomCardProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={{ borderRadius: '25px' }} variant="outlined">
      <CardContent>
        <CardMedia
          component="img"
          height="200"
          image={room.id % 2 === 0 ? '/img/aula-room3.jpg' : '/img/aula-room.jpg'}
          alt="bg image"
          sx={{ borderRadius: '10px', objectFit: 'contain' }}
        />
        <Typography variant="h6" sx={{ mt: 1.5 }} noWrap>
          {capitalize(room.room_name)}
        </Typography>
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
                mx={.25}
                sx={{
                  bgcolor: phases[phase].color,
                  borderRadius: 999,
                }}
              >
                <AppIcon name={phases[phase].icon} size='small' />
                <Typography fontSize='small'>{Math.floor(Math.random() * 11)}</Typography>
              </Stack>
            ))}
          </Stack>
      </CardContent>
      <BottomNavigation
        onChange={(event, newValue) => {
          navigate(`/room/${room.id}/${newValue === 0 ? 'ideas' : 'boxes'}`);
        }}
        showLabels
        sx={{ bgcolor: grey[200] }}
      >
        <BottomNavigationAction
          label="Wild Ideas"
          icon={<AppIcon name="idea" />}
          sx={{ borderRight: `1px solid ${grey[400]}` }}
        />
        <BottomNavigationAction label="Idea Boxes" icon={<AppIcon name="box" />} />
      </BottomNavigation>
    </Card>
  );
};

export default RoomCard;
