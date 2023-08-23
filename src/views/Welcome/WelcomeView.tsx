import { Stack, Typography } from "@mui/material";
import { RoomCards } from "../../components/RoomCards";
import { NotificationsBar } from "../../components/NotificationsBar";
import { UserStats } from "../../components/UserStats";

const WelcomeView = () => {

  return (
    <Stack>
      <NotificationsBar />
      <Typography variant='h5' my={1}>Your Activity</Typography>
      <UserStats />
      <Typography variant='h5' my={2}>Rooms</Typography>
      <RoomCards />
    </Stack>
  );
};

export default WelcomeView;
