import { MergeCandidate } from '@/services/idpMigration';
import { useEffect, useState } from 'react';
import { isAulaOnly, isProviderOnly } from './candidates';

/** Marks the cards that take part in matching. Pairs with the attribute in MatchCell. */
const MATCH_AREA = '[data-match-area]';

/**
 * Picking a record up and dropping it on the opposite side's free half.
 *
 * A pick is held here rather than on the row so it survives paging: the aula
 * record and the provider record it belongs to are rarely on the same page.
 */
export const useMatching = (onAssign: (row: MergeCandidate, localId: number | null) => void) => {
  const [picked, setPicked] = useState<MergeCandidate | null>(null);
  const [over, setOver] = useState<number | null>(null);

  useEffect(() => {
    if (!picked) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest(MATCH_AREA)) setPicked(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPicked(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [picked]);

  const isPicked = (row: MergeCandidate) => picked?.id === row.id;

  /** Only the opposite side's free half can take the pick. */
  const isTarget = (row: MergeCandidate) =>
    !!picked &&
    !isPicked(row) &&
    ((isAulaOnly(picked) && isProviderOnly(row)) || (isProviderOnly(picked) && isAulaOnly(row)));

  const select = (row: MergeCandidate) => setPicked(row);
  const pick = (row: MergeCandidate) => setPicked(isPicked(row) ? null : row);

  /** Either drag direction lands on the same call: the provider row is repointed. */
  const place = (target: MergeCandidate) => {
    if (!picked) return;

    const [provider, aula] = isProviderOnly(picked) ? [picked, target] : [target, picked];

    if (!provider.idp_id || !aula.local_id) return;

    onAssign(provider, aula.local_id);
    setPicked(null);
  };

  return { picked, over, setOver, isPicked, isTarget, select, pick, place };
};

export type Matching = ReturnType<typeof useMatching>;
