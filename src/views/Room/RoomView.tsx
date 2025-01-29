import PhaseBar from '@/layout/PhaseBar';
import { Stack } from '@mui/material';
import { Navigate, Outlet, useParams } from 'react-router-dom';

/**
 * Renders the Room view with phase navigation and content
 * @component RoomView
 * @route /room/:room_id/:phase
 * @description Displays a phase navigation bar at the top and renders child routes
 * in the content area below. Handles cases where room_id is not provided by
 * redirecting to the root path.
 */
const RoomView = () => {
  const { room_id } = useParams<{ room_id: string }>();

  // Redirect to root if no room_id is provided
  if (!room_id) {
    return <Navigate to="/" replace />;
  }

  return (
    <Stack width="100%" height="100%" overflow="hidden">
      <PhaseBar room={room_id} />
      <Stack p={1} sx={{ flexGrow: 1, overflow: 'auto', scrollSnapType: 'y mandatory' }}>
        <Outlet />
      </Stack>
    </Stack>
  );
};

export default RoomView;
