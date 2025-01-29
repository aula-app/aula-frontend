import { StatusTypes } from '@/types/Generics';
import { CommentType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';

/**
 * Fetches comments for a specific idea
 * @param room_id - The ID of the room to fetch ideas for
 * @returns Promise resolving to an array of ideas with custom fields
 */

interface GetCommentsResponse extends GenericResponse {
  data: CommentType[] | null;
}

export async function getCommentsByIdea(idea_id: string): Promise<GetCommentsResponse> {
  const response = await databaseRequest({
    model: 'Comment',
    method: 'getCommentsByIdeaId',
    arguments: { idea_id },
  });

  return response as GetCommentsResponse;
}

/**
 * Sets Comment update types
 */

interface CommentArguments {
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
 * @param arguments - The idea data to add
 * @returns Promise resolving to the new idea
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
 * @param arguments - The idea data to add
 * @returns Promise resolving to the new idea
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
 * @param id - The idea id
 * @returns Promise resolving to the new idea
 */

export async function deleteComment(id: number): Promise<GenericResponse> {
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

  return response as GenericResponse;
}

/**
 * Fetches the like status of an idea
 * @param comment_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
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
 * Adds a like to an idea
 * @param comment_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
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
}

/**
 * Removes a like to an idea
 * @param comment_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
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
}
