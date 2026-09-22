import { getBoxesByPhase } from '@/services/boxes';
import { getIdeasByRoom } from '@/services/ideas';
import { RoomType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { GenericResponse } from '@/services/requests';
import { useCallback, useEffect, useState } from 'react';

export type PhaseCounts = Partial<Record<`${RoomPhases}`, number>>;

// A phase below 0 skips the backend's phase clause, so one request returns every box in the room.
const ALL_PHASES = -1;

const BOX_PHASES = ['10', '20', '30', '40'] as const;

// error_code 2 means "nothing found" — a room with no ideas or no boxes, not a failure.
const failed = (response: GenericResponse) => !!response.error_code && response.error_code !== 2;

/**
 * How much waits in each phase of each room, keyed by room hash_id: ideas in phase 0,
 * boxes in the rest. Two requests per room, both open to every role — the bulk endpoints
 * are restricted to admins and so cannot serve a student's room list.
 */
export const useRoomPhaseCounts = (rooms: RoomType[]): Record<string, PhaseCounts> => {
  const [counts, setCounts] = useState<Record<string, PhaseCounts>>({});
  const roomIds = rooms.map((room) => room.hash_id).join(',');

  const fetchCounts = useCallback(async (): Promise<Record<string, PhaseCounts>> => {
    if (!roomIds) return {};

    const entries = await Promise.all(
      roomIds.split(',').map(async (hash_id): Promise<[string, PhaseCounts]> => {
        const [ideas, boxes] = await Promise.all([getIdeasByRoom(hash_id), getBoxesByPhase(ALL_PHASES, hash_id)]);

        // A phase left without a count reads as still loading, so a failed request adds none.
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
  }, [roomIds]);

  useEffect(() => {
    let active = true;
    fetchCounts().then((entries) => active && setCounts(entries));

    return () => {
      active = false;
    };
  }, [fetchCounts]);

  return counts;
};
