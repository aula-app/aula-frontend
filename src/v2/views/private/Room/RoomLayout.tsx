import PhaseBar from '@/v2/components/ui/PhaseBar';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const RoomLayout = () => {
  const { room_id } = useParams<{ room_id: string }>();

  if (!room_id) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="w-full h-full min-h-0 flex flex-col">
      <PhaseBar room={room_id} />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
};

export default RoomLayout;
