import { getMigrationProgress, MigrationProgress, startIdpConnect } from '@/services/idpMigration';
import { useCallback, useEffect, useState } from 'react';

/** The import runs on a queue, so nothing pushes its completion to the page. */
const IMPORT_POLL_MS = 3000;

/**
 * Follows the school's migration and starts the connect redirect, which needs no
 * room of its own. The review builds its proposal on its own page.
 */
export const useIdpSyncEntry = () => {
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<'connect' | null>(null);

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

  return { progress, status, busy, failed, connect };
};
