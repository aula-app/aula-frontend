import { MergeCandidate } from '@/services/idpMigration';

/** Ambiguous rows need a decision, so they come first. */
const ORDER: Record<MergeCandidate['outcome'], number> = { ambiguous: 0, none: 1, confident: 2 };

export const isPair = (row: MergeCandidate) => !!row.local_id && !!row.idp_id;
export const isAulaOnly = (row: MergeCandidate) => !!row.local_id && !row.idp_id;
export const isProviderOnly = (row: MergeCandidate) => !!row.idp_id && !row.local_id;

/** What becomes of the row once the import runs. */
export type RowKind = 'merge' | 'create' | 'keep';

export const rowKind = (row: MergeCandidate): RowKind => (isPair(row) ? 'merge' : row.idp_id ? 'create' : 'keep');

/**
 * One line per record, ambiguous first.
 *
 * Matching leaves the half it came from standing, so the leftover is dropped
 * rather than showing the record twice.
 */
export const arrange = (rows: MergeCandidate[]): MergeCandidate[] => {
  const paired = rows.filter(isPair);
  const takenLocal = new Set(paired.map((row) => row.local_id));
  const takenIdp = new Set(paired.map((row) => row.idp_id));

  return rows
    .filter(
      (row) =>
        isPair(row) || !((row.local_id && takenLocal.has(row.local_id)) || (row.idp_id && takenIdp.has(row.idp_id)))
    )
    .sort((a, b) => ORDER[a.outcome] - ORDER[b.outcome]);
};

/**
 * The account the row leaves behind.
 *
 * Real name from the provider, display name and avatar from aula — the provider
 * has neither. Created from the provider, the real name serves as both.
 */
export const resultOf = (row: MergeCandidate, isPerson: boolean) => ({
  name: row.idp_name ?? row.local_name ?? '',
  detail: isPerson ? (row.local_displayname ?? row.local_name ?? row.idp_name ?? undefined) : undefined,
  avatar: isPerson ? (row.local_name ?? row.idp_name ?? undefined) : undefined,
});
