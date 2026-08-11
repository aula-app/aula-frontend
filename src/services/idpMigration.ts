import { localStorageGet } from '@/utils';

/**
 * Migrating a school that already uses aula onto an identity provider.
 *
 * Everything here is admin-only on the backend: these calls decide which
 * accounts end up owned by which people.
 */

export type MigrationStatus = 'flagged' | 'connected' | 'reviewing' | 'importing' | 'linking' | 'completed' | null;

export type CandidateKind = 'user' | 'room';

export type CandidateOutcome = 'confident' | 'ambiguous' | 'none';

export interface MergeCandidate {
  id: number;
  kind: CandidateKind;
  /** Null for an account that exists in aula alone. */
  idp_id: string | null;
  idp_name: string | null;
  /** A pseudonym can never be matched by name — the review has to say why. */
  idp_name_kind: 'real' | 'pseudonym' | null;
  /** Null for someone who exists on the provider alone. */
  local_id: number | null;
  local_name: string | null;
  outcome: CandidateOutcome;
  decision: 'merge' | 'create' | null;
}

export interface MigrationProgress {
  migration_status: MigrationStatus;
  linked: number;
  not_yet_linked: number;
  signed_in_at_least_once: number;
}

export interface CandidatePage {
  data: MergeCandidate[];
  total: number;
  per_page: number;
  current_page: number;
}

const headers = (): Record<string, string> => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorageGet('token')}`,
  'aula-instance-code': localStorageGet('code') ?? '',
  'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
});

const apiUrl = (): string => localStorageGet('api_url') ?? '';

const request = async <T>(path: string, init: RequestInit = {}): Promise<T | null> => {
  try {
    const response = await fetch(`${apiUrl()}${path}`, { ...init, headers: headers() });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

/**
 * Where to send the admin so they can prove who they are at the provider.
 *
 * This is what establishes which school the tenant is: the id comes from their
 * own token rather than from anyone choosing it.
 */
export const startIdpConnect = async (): Promise<string | null> => {
  const response = await request<{ url: string }>('/api/v2/auth/idp/connect');

  return response?.url ?? null;
};

/** Build a fresh proposal, discarding any earlier one. */
export const buildProposal = async (): Promise<Record<string, number> | null> => {
  const response = await request<{ counts: Record<string, number> }>('/api/v2/auth/idp/merge-proposal', {
    method: 'POST',
  });

  return response?.counts ?? null;
};

export const getProposal = async (params: {
  kind?: CandidateKind;
  bucket?: 'merges' | 'idp_only' | 'aula_only';
  search?: string;
  page?: number;
  perPage?: number;
}): Promise<CandidatePage | null> => {
  const query = new URLSearchParams();
  if (params.kind) query.set('kind', params.kind);
  if (params.bucket) query.set('bucket', params.bucket);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  query.set('per_page', String(params.perPage ?? 50));

  return request<CandidatePage>(`/api/v2/auth/idp/merge-proposal?${query.toString()}`);
};

/**
 * Record what the admin decided. `local_id` repoints a row, which is the only
 * way to match somebody the name comparison could not reach.
 */
export const saveDecisions = async (
  decisions: Array<{ id: number; decision: 'merge' | 'create' | null; local_id?: number | null }>
): Promise<boolean> => {
  const response = await request<{ success: boolean }>('/api/v2/auth/idp/merge-proposal/decisions', {
    method: 'POST',
    body: JSON.stringify({ decisions }),
  });

  return response?.success === true;
};

/**
 * Stamp the confirmed pairings and start the import.
 *
 * Returns the per-row problems when the backend refuses: a proposal that would
 * fold two people into one account is rejected whole rather than half-applied.
 */
export const applyProposal = async (): Promise<
  { ok: true; applied: Record<string, number> } | { ok: false; problems: Record<string, string> }
> => {
  try {
    const response = await fetch(`${apiUrl()}/api/v2/auth/idp/merge-proposal/apply`, {
      method: 'POST',
      headers: headers(),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) return { ok: false, problems: body?.problems ?? {} };

    return { ok: true, applied: body?.applied ?? {} };
  } catch {
    return { ok: false, problems: {} };
  }
};

export const getMigrationProgress = async (): Promise<MigrationProgress | null> =>
  request<MigrationProgress>('/api/v2/auth/idp/migration-progress');

/**
 * Finish an SSO login as somebody who has no aula account yet.
 *
 * Carries no bearer token on purpose — the point is that this person has no
 * aula credentials, and the one-shot link token is the only thing proving they
 * just authenticated at the provider.
 */
export const declineAccountClaim = async (ssoLinkToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl()}/api/v2/auth/sso/link/decline`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'aula-instance-code': localStorageGet('code') ?? '',
      },
      body: JSON.stringify({ sso_link_token: ssoLinkToken }),
    });

    if (!response.ok) return null;

    const body = await response.json();

    return body?.JWT ?? null;
  } catch {
    return null;
  }
};
