import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { RoomCards } from '@/components/RoomCards';
import { NotificationsBar } from '@/components/NotificationsBar';
import { UserStats } from '@/components/UserStats';
import { blueGrey } from '@mui/material/colors';
import React, { useState } from 'react';

const WelcomeView = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [showNotificationsBar, setNotificationsBar] = useState(true);

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
          position: "fixed",
          top: 56,
          left: 0,
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
        <Stack p={2} pt={0}>
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
          transition: 'all .5s ease-in-out'

        }}>
        Rooms
      </Typography>
      <RoomCards />
    </Stack>
  );
};

export default WelcomeView;
