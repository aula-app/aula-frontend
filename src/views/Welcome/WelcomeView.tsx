import { Fab, Grid, Stack, Typography } from '@mui/material';
import { RoomCard } from '@/components/RoomCard';
import React, { useEffect, useState } from 'react';
import { RoomsResponseType } from '@/types/RoomTypes';
import { databaseRequest } from '@/utils';
import DashBoard from '@/components/DashBoard';
import { Add } from '@mui/icons-material';

const WelcomeView = () => {
  const [rooms, setRooms] = useState({} as RoomsResponseType);
  const [showNotificationsBar, setNotificationsBar] = useState(true);

  const roomsFetch = async () =>
    await databaseRequest('rooms', {}).then((response: RoomsResponseType) => setRooms(response));

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    setNotificationsBar(event.currentTarget.scrollTop === 0);
  };

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack height="100%">
      <DashBoard show={showNotificationsBar} />
      <Stack
        flexGrow={1}
        position="relative"
        onScroll={handleScroll}
        onMouseEnter={() => setNotificationsBar(true)}
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
          Rooms
        </Typography>
        <Grid container spacing={2}>
          {rooms &&
            rooms.data &&
            rooms.data.map((room) => (
              <Grid key={room.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
                <RoomCard room={room} />
              </Grid>
            ))}
        </Grid>
      </Stack>
      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
          m: 2,
        }}
      >
        <Add />
      </Fab>
    </Stack>
  );
};

export default WelcomeView;
