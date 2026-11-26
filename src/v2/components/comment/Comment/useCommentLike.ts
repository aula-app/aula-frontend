import { addCommentLike, getCommentLike, removeCommentLike } from '@/services/comments';
import { CommentType } from '@/types/Scopes';
import { LikeState, useLike } from '@/v2/hooks/useLike';

export const useCommentLike = (comment: CommentType): LikeState =>
  useLike({
    id: comment.id,
    sumLikes: comment.sum_likes,
    getStatus: () => getCommentLike(comment.id),
    add: () => addCommentLike(comment.id),
    remove: () => removeCommentLike(comment.id),
  });
