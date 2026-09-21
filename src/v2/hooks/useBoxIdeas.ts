import { getIdeasByBox } from '@/services/ideas';
import { BoxType, IdeaType } from '@/types/Scopes';
import { useCallback, useEffect, useState } from 'react';

interface UseBoxIdeasState {
  /** The ideas each box holds, keyed by box hash_id. */
  ideas: Record<string, IdeaType[]>;
  /** Reloads every box's ideas. */
  refetch: () => Promise<void>;
}

/** The ideas each box holds, keyed by box hash_id. One request per box. */
export const useBoxIdeas = (boxes: BoxType[], enabled = true): UseBoxIdeasState => {
  const [ideas, setIdeas] = useState<Record<string, IdeaType[]>>({});
  const boxIds = boxes.map((box) => box.hash_id).join(',');

  const fetchIdeas = useCallback(async (): Promise<Record<string, IdeaType[]>> => {
    if (!enabled || !boxIds) return {};

    const entries = await Promise.all(
      boxIds.split(',').map(async (hash_id): Promise<[string, IdeaType[]]> => {
        const response = await getIdeasByBox({ topic_id: hash_id });
        return [hash_id, Array.isArray(response.data) ? response.data : []];
      })
    );

    return Object.fromEntries(entries);
  }, [boxIds, enabled]);

  const refetch = useCallback(async () => setIdeas(await fetchIdeas()), [fetchIdeas]);

  useEffect(() => {
    let active = true;
    fetchIdeas().then((entries) => active && setIdeas(entries));

    return () => {
      active = false;
    };
  }, [fetchIdeas]);

  return { ideas, refetch };
};
