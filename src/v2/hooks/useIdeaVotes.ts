import { getVote } from '@/services/vote';
import { IdeaType } from '@/types/Scopes';
import { checkPermissions, Vote } from '@/utils';
import { useEffect, useState } from 'react';

/** The current user's own vote per idea, keyed by hash_id, or null where they have not voted. */
export const useIdeaVotes = (ideas: IdeaType[], enabled: boolean): Record<string, Vote | null> => {
  const [votes, setVotes] = useState<Record<string, Vote | null>>({});
  const ideaIds = ideas.map((idea) => idea.hash_id).join(',');

  useEffect(() => {
    if (!enabled || !ideaIds || !checkPermissions('ideas', 'vote')) {
      setVotes({});
      return;
    }

    let active = true;
    Promise.all(
      ideaIds.split(',').map(async (hash_id): Promise<[string, Vote | null]> => {
        const response = await getVote(hash_id);
        return [hash_id, typeof response.data === 'number' ? response.data : null];
      })
    ).then((entries) => active && setVotes(Object.fromEntries(entries)));

    return () => {
      active = false;
    };
  }, [ideaIds, enabled]);

  return votes;
};
