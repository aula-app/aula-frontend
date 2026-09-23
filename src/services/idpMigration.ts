import { localStorageGet } from '@/utils';

export type MigrationStatus = 'flagged' | 'connected' | 'reviewing' | 'importing' | 'linking' | 'completed' | null;

export type CandidateKind = 'user' | 'room';

export type CandidateOutcome = 'confident' | 'ambiguous' | 'none';

export interface RoomRef {
  id: number;
  name: string;
}

export interface GroupRef {
  id: string;
  name: string;
}

export interface MergeCandidate {
  id: number;
  kind: CandidateKind;
  idp_id: string | null;
  idp_name: string | null;
  idp_name_kind: 'real' | 'pseudonym' | null;
  local_id: number | null;
  local_name: string | null;
  /** Users only. */
  local_displayname?: string | null;
  local_realname?: string | null;
  local_avatar?: string | null;
  /** Users only. */
  local_rooms?: RoomRef[] | null;
  idp_groups?: GroupRef[] | null;
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

export const startIdpConnect = async (): Promise<string | null> => {
  const response = await request<{ url: string }>('/api/v2/auth/idp/connect');

  return response?.url ?? null;
};

/** Discards any earlier proposal. */
export const buildProposal = async (): Promise<Record<string, number> | null> => {
  const response = await request<{ counts: Record<string, number> }>('/api/v2/auth/idp/merge-proposal', {
    method: 'POST',
  });

  return response?.counts ?? null;
};

export const getProposal = async (params: {
  kind?: CandidateKind;
  bucket?: 'merges' | 'idp_only' | 'aula_only';
  page?: number;
  perPage?: number;
}): Promise<CandidatePage | null> => {
  const query = new URLSearchParams();
  if (params.kind) query.set('kind', params.kind);
  if (params.bucket) query.set('bucket', params.bucket);
  if (params.page) query.set('page', String(params.page));
  query.set('per_page', String(params.perPage ?? 50));

  return request<CandidatePage>(`/api/v2/auth/idp/merge-proposal?${query.toString()}`);
};

/** Backend limit. */
const MAX_PER_PAGE = 200;

export const getAllProposals = async (kind: CandidateKind): Promise<MergeCandidate[] | null> => {
  const first = await getProposal({ kind, page: 1, perPage: MAX_PER_PAGE });

  if (!first) return null;

  const pageCount = Math.ceil(first.total / MAX_PER_PAGE);
  const rest = await Promise.all(
    Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
      getProposal({ kind, page: index + 2, perPage: MAX_PER_PAGE })
    )
  );

  if (rest.includes(null)) return null;

  return [first, ...rest].flatMap((page) => page?.data ?? []);
};

/** `local_id` repoints a row at another aula record. */
export const saveDecisions = async (
  decisions: Array<{ id: number; decision: 'merge' | 'create' | null; local_id?: number | null }>
): Promise<boolean> => {
  const response = await request<{ success: boolean }>('/api/v2/auth/idp/merge-proposal/decisions', {
    method: 'POST',
    body: JSON.stringify({ decisions }),
  });

  return response?.success === true;
};

/** Rejected whole when any row is invalid; returns the per-row problems. */
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

/** Cached for the page's lifetime: it cannot change within a session. */
let providerPromise: Promise<string | null> | null = null;

export const getIdpProvider = (): Promise<string | null> => {
  providerPromise ??= request<{ provider: string | null }>('/api/v2/auth/idp/import-status').then(
    (response) => response?.provider ?? null
  );

  return providerPromise;
};

/** No bearer token: the one-shot link token is the only credential. */
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
