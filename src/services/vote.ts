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

export type ResultResponse = Record<'votes_negative' | 'votes_neutral' | 'votes_positive', number>;

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
