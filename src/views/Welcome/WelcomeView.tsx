import { Grid, Stack, Typography } from '@mui/material';
import { RoomCard } from '@/components/RoomCard';
import React, { useEffect, useState } from 'react';
import { RoomsResponseType } from '@/types/scopes/RoomTypes';
import { databaseRequest } from '@/utils';
import DashBoard from '@/components/DashBoard';
import AskConsent from '../AskConsent/AskConsentView';
import { useTranslation } from 'react-i18next';

const WelcomeView = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState({} as RoomsResponseType);
  const [showDashboard, setDashboard] = useState(true);

  const roomsFetch = async () =>
    await databaseRequest({
      model: 'Room',
      method: 'getRooms',
      arguments: {
        offset: 0,
        limit: 0,
      },
    }).then((response: RoomsResponseType) => setRooms(response));

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    setDashboard(false);
  };

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack height="100%">
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
              <Grid key={room.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
                <RoomCard room={room} />
              </Grid>
            ))}
        </Grid>
      </Stack>
      <AskConsent />
    </Stack>
  );
};

export default WelcomeView;
