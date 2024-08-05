import DashBoard from '@/components/DashBoard';
import { RoomCard } from '@/components/RoomCard';
import { RoomsResponseType } from '@/types/RequestTypes';
import { databaseRequest } from '@/utils';
import { Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<RoomsResponseType>();
  const [showDashboard, setDashboard] = useState(true);

  const roomsFetch = async () =>
    await databaseRequest({
      model: 'Room',
      method: 'getRooms',
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response) => setRooms(response));

  const handleScroll = () => {
    setDashboard(false);
  };

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack height="100%" sx={{ p: { md: 1 } }}>
      <DashBoard show={showDashboard} />
      <Stack
        flexGrow={1}
        position="relative"
        onScroll={handleScroll}
        sx={{
          px: 2,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
      >
        <Typography
          variant="h4"
          className="noSpace"
          sx={{
            pt: 2,
            scrollSnapAlign: 'start',
            transition: 'all .5s ease-in-out',
          }}
        >
          {t('views.rooms')}
        </Typography>
        <Grid container flex={1} spacing={2}>
          {rooms &&
            rooms.data &&
            rooms.data.map((room) => (
              <Grid key={room.id} item xs={12} sm={6} lg={4} xl={3} sx={{ scrollSnapAlign: 'center' }}>
                <RoomCard room={room} />
              </Grid>
            ))}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
