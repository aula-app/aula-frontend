import PhaseBar from '@/v2/components/ui/PhaseBar';
import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const RoomLayout = () => {
  const { room_id } = useParams<{ room_id: string }>();
  const [, dispatch] = useAppStore();

  // The breadcrumb (and its accessible label) is the only place the room name
  // surfaces on room pages — mirror the SET_BREADCRUMB dispatch of the v1 views.
  useEffect(() => {
    if (!room_id) return;
    getRoom(room_id).then((response) => {
      if (response.error || !response.data) return;
      dispatch({
        action: 'SET_BREADCRUMB',
        breadcrumb: [[response.data.room_name, `/room/${room_id}/phase/0`]],
      });
    });
  }, [room_id, dispatch]);

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
