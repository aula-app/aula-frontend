import { Grid, Stack, Typography } from '@mui/material';
import { RoomCard } from '@/components/RoomCard';
import React, { useEffect, useState } from 'react';
import { RoomsResponseType } from '@/types/RoomTypes';
import { databaseRequest } from '@/utils/requests';
import DashBoard from '@/components/DashBoard';

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
        {rooms &&
          rooms.data &&
          rooms.data.map(room => (
            <Grid key={room.id} item xs={12} my={1} sx={{ scrollSnapAlign: 'center' }}>
              <RoomCard room={room} />
            </Grid>
          ))}
      </Stack>
    </Stack>
  );
};

export default WelcomeView;
