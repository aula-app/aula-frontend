import { MergeCandidate } from '@/services/idpMigration';
import { useEffect, useState } from 'react';
import { isAulaOnly, isProviderOnly } from './candidates';

/** Clicks inside this keep the pick. */
const KEEPS_PICK = '[data-keeps-pick]';

/** Held here, not on the row, so a pick survives paging. */
export const useMatching = (onAssign: (row: MergeCandidate, localId: number | null) => void) => {
  const [picked, setPicked] = useState<MergeCandidate | null>(null);
  const [over, setOver] = useState<number | null>(null);

  useEffect(() => {
    if (!picked) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest(KEEPS_PICK)) setPicked(null);
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

  const isTarget = (row: MergeCandidate) =>
    !!picked &&
    !isPicked(row) &&
    ((isAulaOnly(picked) && isProviderOnly(row)) || (isProviderOnly(picked) && isAulaOnly(row)));

  const select = (row: MergeCandidate) => setPicked(row);
  const pick = (row: MergeCandidate) => setPicked(isPicked(row) ? null : row);

  /** Either direction repoints the provider row. */
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
