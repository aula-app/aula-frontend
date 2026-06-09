import PhaseBar from '@/components/PhaseBar';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const RoomLayout = () => {
  const { room_id } = useParams<{ room_id: string }>();

  if (!room_id) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="w-fill h-full overflow-hidden">
      <PhaseBar room={room_id} />
      <div className="p-1 flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default RoomLayout;
