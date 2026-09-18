import { getIdeasByBox } from '@/services/ideas';
import { BoxType, IdeaType } from '@/types/Scopes';
import { useEffect, useState } from 'react';

/** The ideas each box holds, keyed by box hash_id. One request per box. */
export const useBoxIdeas = (boxes: BoxType[], enabled = true): Record<string, IdeaType[]> => {
  const [ideas, setIdeas] = useState<Record<string, IdeaType[]>>({});
  const boxIds = boxes.map((box) => box.hash_id).join(',');

  useEffect(() => {
    if (!enabled || !boxIds) {
      setIdeas({});
      return;
    }

    let active = true;
    Promise.all(
      boxIds.split(',').map(async (hash_id): Promise<[string, IdeaType[]]> => {
        const response = await getIdeasByBox({ topic_id: hash_id });
        return [hash_id, response.data || []];
      })
    ).then((entries) => active && setIdeas(Object.fromEntries(entries)));

    return () => {
      active = false;
    };
  }, [boxIds, enabled]);

  return ideas;
};
