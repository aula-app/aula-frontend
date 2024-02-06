import { Paper, Stack, Typography } from '@mui/material';
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
    if (currentScroll === 0 || scrollTop > currentScroll) {
      setNotificationsBar(true);
    } else {
      setNotificationsBar(false);
    }
    setScrollTop(currentScroll);
  };

  return (
    <Stack height="100%" flexGrow={1}>
      <Stack sx={{
        alignItems: 'center',
        bgcolor: blueGrey[50],
        maxHeight: `${showNotificationsBar ? 50 : 0}px`,
        overflow: 'clip',
        transition: 'all 1s ease-in-out'
      }}
      >
        <NotificationsBar />
      </Stack>
      <Paper
        onScroll={handleScroll}
        elevation={8}
        sx={{
          px: 2,
          overflowY: 'auto',
          scrollSnapType: 'y mandatory'
        }}>
        <Stack sx={{scrollSnapAlign: 'start'}}>
          <Typography variant="h4" pt={2} pb={1}>
            Your Activity
          </Typography>
          <UserStats />
        </Stack>
        <Typography variant="h4" pt={2} sx={{scrollSnapAlign: 'start'}}>
          Rooms
        </Typography>
        <RoomCards />
      </Paper>
    </Stack>
  );
};

export default WelcomeView;
