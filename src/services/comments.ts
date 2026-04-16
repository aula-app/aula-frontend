import { databaseRequest, GenericResponse } from '@/services/requests';
import { StatusTypes } from '@/types/Generics';
import { CommentType } from '@/types/Scopes';

/**
 * Fetches comments for a specific idea
 * @param room_id - The ID of the room to fetch ideas for
 * @returns Promise resolving to an array of ideas with custom fields
 */

interface GetCommentsResponse extends GenericResponse {
  data: CommentType[] | null;
}
const ORDER_BY_CREATION_DATE = 4;

export async function getCommentsByIdea(idea_id: string): Promise<GetCommentsResponse> {
  const response = await databaseRequest({
    model: 'Comment',
    method: 'getCommentsByIdeaId',
    arguments: { idea_id, orderby: ORDER_BY_CREATION_DATE },
  });

  return response as GetCommentsResponse;
}

/**
 * Sets Comment update types
 */

export interface CommentArguments {
  content: string;
  status?: StatusTypes;
}

interface AddCommentArguments extends CommentArguments {
  idea_id: string;
}

interface EditCommentArguments extends CommentArguments {
  comment_id: string;
  idea_id?: string;
}

/**
 * Adds a new comment to the database
 * @param arguments - The comment data to add
 * @returns Promise resolving to the new Comment
 */
export async function addComment(args: AddCommentArguments): Promise<GetCommentsResponse> {
  const response = await databaseRequest(
    {
      model: 'Comment',
      method: 'addComment',
      arguments: args,
    },
    ['user_id']
  );

  return response as GetCommentsResponse;
}

/**
 * Edit a comment on the database
 * @param arguments - The comment data to add
 * @returns Promise resolving to the updated Comment response
 */
export async function editComment(args: EditCommentArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Comment',
      method: 'editComment',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes a comment from the database
 * @param id - The Comment id
 * @returns Promise resolving to false if the response.error is Truthy, or true if the response.error is Falsy
 */
export async function deleteComment(id: number): Promise<boolean> {
  const response = await databaseRequest(
    {
      model: 'Comment',
      method: 'deleteComment',
      arguments: {
        comment_id: id,
      },
    },
    ['updater_id']
  );

  return !response.error;
}

/**
 * Fetches the like status of an Comment
 * @param comment_id - The ID of the comment to like
 * @returns Promise resolving to true if response contains non-empty data
 */
export async function getCommentLike(comment_id: number): Promise<boolean> {
  const response = await databaseRequest(
    {
      model: 'Comment',
      method: 'getLikeStatus',
      arguments: { comment_id },
    },
    ['user_id']
  );

  return Boolean(response.data);
}

/**
 * Adds a like to a Comment
 * @param comment_id - The ID of the comment to like
 */
export async function addCommentLike(comment_id: number): Promise<void> {
  await databaseRequest(
    {
      model: 'Comment',
      method: 'CommentAddLike',
      arguments: { comment_id },
    },
    ['user_id']
  );

  return response;
}

/**
 * Removes a like from a Comment
 * @param comment_id - The ID of the comment to un-like
 */
export async function removeCommentLike(comment_id: number): Promise<void> {
  await databaseRequest(
    {
      model: 'Comment',
      method: 'CommentRemoveLike',
      arguments: { comment_id },
    },
    ['user_id']
  );

  return response;
}
