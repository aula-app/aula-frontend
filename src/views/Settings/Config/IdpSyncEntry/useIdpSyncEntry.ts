import { buildProposal, getMigrationProgress, MigrationProgress, startIdpConnect } from '@/services/idpMigration';
import { useCallback, useEffect, useState } from 'react';

/** The import runs on a queue, so nothing pushes its completion to the page. */
const IMPORT_POLL_MS = 3000;

/**
 * Follows the school's migration and carries out the steps that need no room
 * of their own.
 *
 * Connecting and preparing are a redirect and a single call, so they belong
 * where the admin already is. Only the review needs a page.
 */
export const useIdpSyncEntry = () => {
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<'connect' | 'prepare' | null>(null);

  const refresh = useCallback(async () => {
    setProgress(await getMigrationProgress());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const status = progress?.migration_status ?? null;

  useEffect(() => {
    if (status !== 'importing') return;

    const timer = setInterval(refresh, IMPORT_POLL_MS);

    return () => clearInterval(timer);
  }, [status, refresh]);

  const connect = async () => {
    setBusy(true);
    setFailed(null);
    const url = await startIdpConnect();
    setBusy(false);

    if (!url) {
      setFailed('connect');

      return;
    }

    window.location.href = url;
  };

  const prepare = async () => {
    setBusy(true);
    setFailed(null);
    const counts = await buildProposal();
    setBusy(false);

    if (!counts) {
      setFailed('prepare');

      return;
    }

    await refresh();
  };

  return { progress, status, busy, failed, connect, prepare, refresh };
};
