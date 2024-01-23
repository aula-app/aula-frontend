import { Stack, Typography } from '@mui/material';
import { RoomCards } from '@/components/RoomCards';
import { NotificationsBar } from '@/components/NotificationsBar';
import { UserStats } from '@/components/UserStats';

const WelcomeView = () => {
  return (
    <Stack height="100%" flexGrow={1}>
      <NotificationsBar />
      <Stack flexGrow={1} px={2} overflow="auto">
        <Typography variant="h5" my={1}>
          Your Activity
        </Typography>
        <UserStats />
        <Typography variant="h5" my={2}>
          Rooms
        </Typography>
        <RoomCards />
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
