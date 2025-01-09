import PhaseBar from '@/layout/PhaseBar';
import { Stack } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';

/**
 * Renders "Room" view
 * url: /room/:room_id/:phase
 */
const RoomView = () => {
  const params = useParams();
  return (
    params.room_id && (
      <Stack width="100%" height="100%" overflow="hidden">
        <PhaseBar room={params.room_id} />
        <Stack p={1} sx={{ flexGrow: 1, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
          <Outlet />
        </Stack>
      </Stack>
    )
  );
};

export default RoomView;
