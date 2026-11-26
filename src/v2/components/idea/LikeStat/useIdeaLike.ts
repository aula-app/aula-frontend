import { addIdeaLike, getIdeaLike, removeIdeaLike } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
import { LikeState, useLike } from '@/v2/hooks/useLike';

export type { LikeState };

export const useIdeaLike = (idea: IdeaType): LikeState =>
  useLike({
    id: idea.hash_id,
    sumLikes: idea.sum_likes,
    getStatus: () => getIdeaLike(idea.hash_id),
    add: () => addIdeaLike(idea.hash_id),
    remove: () => removeIdeaLike(idea.hash_id),
  });
