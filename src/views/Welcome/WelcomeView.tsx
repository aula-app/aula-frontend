import { Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { RoomCard } from '@/components/RoomCard';
import { NotificationsBar } from '@/components/NotificationsBar';
import { UserStats } from '@/components/UserStats';
import { blueGrey } from '@mui/material/colors';
import React, { useEffect, useState } from 'react';
import { RoomsResponseType } from '@/types/RoomTypes';
import { databaseRequest } from '@/utils/requests';
import { useParams } from 'react-router-dom';
import { AppLink } from '@/components';

const WelcomeView = () => {
  const params = useParams();
  const [scrollTop, setScrollTop] = useState(0);
  const [rooms, setRooms] = useState({} as RoomsResponseType);
  const [showNotificationsBar, setNotificationsBar] = useState(true);

  const roomsFetch = async () =>
    await databaseRequest('rooms', {})
    .then((response: RoomsResponseType) => setRooms(response));

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    let currentScroll = event.currentTarget.scrollTop;
    if (currentScroll === 0) {
      setNotificationsBar(true);
    } else if (currentScroll !== scrollTop) {
      setNotificationsBar(false);
    }
    setScrollTop(currentScroll);
  };

  const toggleNotifications = () => {
    const newValue = !showNotificationsBar;
    setNotificationsBar(newValue);
  };

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack
      height="100%"
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
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          top: 56,
          left: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: blueGrey[50],
          maxHeight: `${showNotificationsBar ? 250 : 25}px`,
          overflow: 'clip',
          transition: 'all .5s ease-in-out',
          zIndex: 300,
        }}
      >
        <NotificationsBar />
        <Stack p={2} pt={0} width="100%">
          <Typography variant="h4" pt={2}>
            Your Activity
          </Typography>
          <UserStats />
        </Stack>
        <Box position="absolute" bottom={0} width="100%" bgcolor={blueGrey[50]}>
          <Button sx={{ width: '100%', py: 1 }} onClick={toggleNotifications}>
            <Divider sx={{ width: '50%' }} variant="middle" />
          </Button>
        </Box>
      </Paper>
      <Typography
        variant="h4"
        pt={scrollTop === 0 && showNotificationsBar ? 30 : 4}
        sx={{
          scrollSnapAlign: 'start',
          transition: 'all .5s ease-in-out',
        }}
      >
        Rooms
      </Typography>
      {rooms.data &&
        rooms.data.map((room) => (
          <Grid key={room.id} item xs={12} md={4} my={2} sx={{ scrollSnapAlign: 'center' }}>
            <AppLink to={`/room/${room.id}`}>
              <RoomCard room={room} key={room.id} />
            </AppLink>
          </Grid>
        ))}
    </Stack>
  );
};

export default WelcomeView;
