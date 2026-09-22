import PhaseBar from '@/v2/components/ui/PhaseBar';
import { getRoom } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const isValidPhase = (phase: string): phase is `${RoomPhases}` => Object.keys(phases).includes(phase);

const RoomLayout = () => {
  const { room_id, phase } = useParams<{ room_id: string; phase: string }>();
  const [, dispatch] = useAppStore();

  // The phase-0 route is a literal path with no :phase param, so an absent one means Wild Ideas.
  const currentPhase = phase && isValidPhase(phase) ? phase : '0';

  // The breadcrumb is the only place the room name surfaces on room pages
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
      <PhaseBar room={room_id} phase={currentPhase} />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
};

export default RoomLayout;
