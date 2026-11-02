import { getBoxesByPhase } from '@/services/boxes';
import { getIdeasByRoom } from '@/services/ideas';
import { RoomPhases } from '@/types/SettingsTypes';
import { GenericResponse } from '@/services/requests';
import { useCallback, useEffect, useState } from 'react';

export type PhaseCounts = Partial<Record<`${RoomPhases}`, number>>;

// A phase below 0 skips the backend's phase clause, so one request returns every box in the room.
const ALL_PHASES = -1;

const BOX_PHASES = ['10', '20', '30', '40'] as const;

// Ids and refresh key travel as one string: an inline array argument would refetch every render.
const KEY_SEPARATOR = '|';

// error_code 2 means "nothing found" — a room with no ideas or no boxes, not a failure.
const failed = (response: GenericResponse) => !!response.error_code && response.error_code !== 2;

/**
 * How much waits in each phase of each room, keyed by room hash_id: ideas in phase 0, boxes in the
 * rest. Two requests per room rather than the bulk endpoints, which are restricted to admins.
 *
 * @param roomIds hash_ids of the rooms to count.
 * @param refreshKey Changing it refetches.
 */
export const useRoomPhaseCounts = (
  roomIds: string[],
  refreshKey: string | number = ''
): Record<string, PhaseCounts> => {
  const [counts, setCounts] = useState<Record<string, PhaseCounts>>({});
  const fetchKey = [refreshKey, ...roomIds].join(KEY_SEPARATOR);

  const fetchCounts = useCallback(async (): Promise<Record<string, PhaseCounts>> => {
    const [, ...ids] = fetchKey.split(KEY_SEPARATOR);
    if (!ids.length) return {};

    const entries = await Promise.all(
      ids.map(async (hash_id): Promise<[string, PhaseCounts]> => {
        const [ideas, boxes] = await Promise.all([getIdeasByRoom(hash_id), getBoxesByPhase(ALL_PHASES, hash_id)]);

        const roomCounts: PhaseCounts = {};

        if (!failed(ideas)) roomCounts['0'] = Array.isArray(ideas.data) ? ideas.data.length : 0;

        if (!failed(boxes)) {
          BOX_PHASES.forEach((phase) => (roomCounts[phase] = 0));
          (Array.isArray(boxes.data) ? boxes.data : []).forEach((box) => {
            const phase = String(box.phase_id) as `${RoomPhases}`;
            roomCounts[phase] = (roomCounts[phase] ?? 0) + 1;
          });
        }

        return [hash_id, roomCounts];
      })
    );

    return Object.fromEntries(entries);
  }, [fetchKey]);

  useEffect(() => {
    let active = true;
    fetchCounts().then((entries) => active && setCounts(entries));

    return () => {
      active = false;
    };
  }, [fetchCounts]);

  return counts;
};

/** The same counts for a single room, refetched whenever `refreshKey` changes. */
export const useRoomCounts = (room_id?: string, refreshKey: string | number = ''): PhaseCounts | undefined => {
  const counts = useRoomPhaseCounts(room_id ? [room_id] : [], refreshKey);

  return room_id ? counts[room_id] : undefined;
};
