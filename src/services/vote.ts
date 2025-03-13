import { Vote } from '@/utils';
import { databaseRequest, GenericResponse } from './requests';

/**
 * Get vote value.
 */

interface GetVoteResponse extends GenericResponse {
  data: Vote | null;
}

export async function getVote(idea_id: string): Promise<GetVoteResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'getVoteValue',
      arguments: { idea_id },
    },
    ['user_id']
  );

  return response as GetVoteResponse;
}

/**
 * Get current vote distribution.
 */

export type ResultResponse = Record<'votes_negative' | 'votes_neutral' | 'votes_positive' | 'total_votes', number>;

interface GetVoteResultResponse extends GenericResponse {
  data: ResultResponse | null;
}

export async function getVoteResults(idea_id: string): Promise<GetVoteResultResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeaVoteStats',
    arguments: { idea_id },
  });

  return response as GetVoteResultResponse;
}

export async function setToWinning(idea_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'setToWinning',
      arguments: { idea_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

export async function setToLosing(idea_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'setToLosing',
      arguments: { idea_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Get Quorum.
 */

type QuorumResponse = Record<'quorum_votes' | 'quorum_wild_ideas', number>;

interface GetQuorumResponse extends GenericResponse {
  data: QuorumResponse | null;
}

export async function getQuorum(): Promise<GetQuorumResponse> {
  const response = await databaseRequest({
    model: 'Settings',
    method: 'getQuorum',
    arguments: {},
  });

  return response as GetQuorumResponse;
}

/**
 * Add Quorum.
 */

export async function setQuorum(quorum_wild_ideas: number, quorum_votes: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Settings',
      method: 'setQuorum',
      arguments: { quorum_wild_ideas, quorum_votes },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Register vote.
 */

export async function addVote(idea_id: string, vote_value: Vote): Promise<GetVoteResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'voteForIdea',
      arguments: { idea_id, vote_value },
    },
    ['user_id']
  );

  return response as GetVoteResponse;
}
