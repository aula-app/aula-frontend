import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import PhaseBar from '@/layout/PhaseBar';

/**
 * Renders "Room" view
 * url: /room/:room_id/:phase
 */
const RoomView = () => {
  return (
    <Stack width="100%" height="100%" overflow="hidden" p={1}>
      <PhaseBar />
      <Stack sx={{ flexGrow: 1, pt: 1, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

export default RoomView;
