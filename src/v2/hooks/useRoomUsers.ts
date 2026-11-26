import { getRoom } from '@/services/rooms';
import { useEffect, useState } from 'react';

/** Idea endpoints don't all return the member count. */
export const useRoomUsers = (room_id: string | undefined): number => {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    if (!room_id) return;
    let active = true;
    getRoom(room_id).then((response) => {
      if (active && response.data) setUsers(Number(response.data.number_of_users) || 0);
    });
    return () => {
      active = false;
    };
  }, [room_id]);

  return users;
};
