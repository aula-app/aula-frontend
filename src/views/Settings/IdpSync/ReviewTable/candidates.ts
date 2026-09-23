import { createTextFilter } from '@/hooks/useFilter';
import { MergeCandidate } from '@/services/idpMigration';
import { Comparators } from '@/v2/hooks/useListSort';

export const isPair = (row: MergeCandidate) => !!row.local_id && !!row.idp_id;
export const isAulaOnly = (row: MergeCandidate) => !!row.local_id && !row.idp_id;
export const isProviderOnly = (row: MergeCandidate) => !!row.idp_id && !row.local_id;

export type RowKind = 'merge' | 'create' | 'keep';

export const rowKind = (row: MergeCandidate): RowKind => (isPair(row) ? 'merge' : row.idp_id ? 'create' : 'keep');

/** Drops the half a manual match leaves behind, so each record shows once. */
export const arrange = (rows: MergeCandidate[]): MergeCandidate[] => {
  const paired = rows.filter(isPair);
  const takenLocal = new Set(paired.map((row) => row.local_id));
  const takenIdp = new Set(paired.map((row) => row.idp_id));

  return rows.filter(
    (row) =>
      isPair(row) || !((row.local_id && takenLocal.has(row.local_id)) || (row.idp_id && takenIdp.has(row.idp_id)))
  );
};

/** `local_name` last: a manual match can leave a display name in it. */
export const realName = (row: MergeCandidate) =>
  (row.idp_name_kind === 'pseudonym' ? null : row.idp_name) ??
  row.local_realname ??
  row.local_name ??
  row.idp_name ??
  '';

export const compareNames = new Intl.Collator().compare;

const byName = (a: MergeCandidate, b: MergeCandidate) => compareNames(realName(a), realName(b));

const STATUS: Record<RowKind, number> = { keep: 0, create: 1, merge: 2 };

const CONFIDENCE: Record<MergeCandidate['outcome'], number> = { ambiguous: 0, none: 1, confident: 2 };

export const SORTS: Comparators<MergeCandidate> = {
  name: byName,
  status: (a, b) => STATUS[rowKind(a)] - STATUS[rowKind(b)] || byName(a, b),
  confidence: (a, b) => CONFIDENCE[a.outcome] - CONFIDENCE[b.outcome] || byName(a, b),
};

export const resultName = (row: MergeCandidate) => row.idp_name ?? row.local_name ?? '';

export const resultOf = (row: MergeCandidate, isPerson: boolean) => ({
  name: resultName(row),
  detail: isPerson ? (row.local_displayname ?? row.local_name ?? row.idp_name ?? undefined) : undefined,
  avatar: isPerson ? (row.local_name ?? row.idp_name ?? undefined) : undefined,
});

const searchNames = createTextFilter<MergeCandidate>(['local_name', 'idp_name']);

export const searchRows = (rows: MergeCandidate[], term: string) => {
  const needle = term.trim();

  return needle ? searchNames(rows, needle) : rows;
};

export interface Member {
  name: string;
  kind: RowKind;
}

/** Sorted; null for a side the class does not have. */
export interface Members {
  aula: Member[] | null;
  provider: Member[] | null;
  /** Both sides, each person once. */
  merged: Member[];
  /** Row ids of `merged`. */
  ids: Set<number>;
}

const toMembers = (people: MergeCandidate[]): Member[] =>
  people
    .map((person) => ({ name: realName(person), kind: rowKind(person) }))
    .sort((a, b) => compareNames(a.name, b.name));

const append = <K>(index: Map<K, MergeCandidate[]>, key: K, person: MergeCandidate) => {
  const list = index.get(key);

  if (list) list.push(person);
  else index.set(key, [person]);
};

/** Expects `people` arranged, or a matched person is listed twice. */
export const membersByRoom = (rooms: MergeCandidate[], people: MergeCandidate[]): Map<number, Members> => {
  const aula = new Map<number, MergeCandidate[]>();
  const provider = new Map<string, MergeCandidate[]>();

  for (const person of people) {
    for (const enrolment of person.local_rooms ?? []) append(aula, enrolment.id, person);
    for (const group of person.idp_groups ?? []) append(provider, group.id, person);
  }

  return new Map(
    rooms.map((room) => {
      const inAula = room.local_id === null ? null : (aula.get(room.local_id) ?? []);
      const atProvider = room.idp_id === null ? null : (provider.get(room.idp_id) ?? []);
      const everyone = [...new Set([...(inAula ?? []), ...(atProvider ?? [])])];

      return [
        room.id,
        {
          aula: inAula && toMembers(inAula),
          provider: atProvider && toMembers(atProvider),
          merged: toMembers(everyone),
          ids: new Set(everyone.map((person) => person.id)),
        },
      ];
    })
  );
};
