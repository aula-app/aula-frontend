import { Stack } from "@mui/material";
import { RoomCards } from "../../components/RoomCards";
import { NotificationsBar } from "../../components/NotificationsBar";
import { UserStats } from "../../components/UserStats";

const WelcomeView = () => {

  return (
    <Stack>
      <NotificationsBar />
      <UserStats />
      <RoomCards />
    </Stack>
  );
};

export default WelcomeView;
