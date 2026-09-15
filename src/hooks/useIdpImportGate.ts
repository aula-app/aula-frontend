import { getIdpImportStatus, IdpImportStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

/** How often to ask the backend whether the school import has finished. */
const POLL_INTERVAL_MS = 2000;

/**
 * Give up waiting after this long and let the user in anyway.
 *
 * A stuck import must not lock a school out of aula permanently; the rooms and
 * users appear as the queue catches up.
 */
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export type IdpImportPhase =
  /** Still asking. Nothing has been shown yet. */
  | 'checking'
  /** The school is being pulled in; hold the user here. */
  | 'importing'
  /** Finished while we were watching — tell the user before letting them in. */
  | 'done'
  | 'failed'
  /** Nothing to wait for: no directory, already imported, or dismissed. */
  | 'clear';

/**
 * Holds a user out of aula while their school is imported from its identity
 * provider, and tells them when it has finished.
 *
 * The first person to sign in at a school triggers the import; everyone after
 * that finds their account already there. So this waits at most once per
 * school, and schools that sync from no directory fall straight through.
 *
 * `done` is only ever reported to someone who actually waited. Arriving at a
 * school that was set up long ago reports `clear` immediately, so nobody is
 * shown a completion notice for an import they never saw.
 */
export const useIdpImportGate = () => {
  const [phase, setPhase] = useState<IdpImportPhase>('checking');
  const [status, setStatus] = useState<IdpImportStatus | null>(null);
  const sawImport = useRef(false);

  /** Acknowledge the completion notice and enter aula. */
  const dismiss = useCallback(() => setPhase('clear'), []);

  useEffect(() => {
    let cancelled = false;

    const read = async (): Promise<IdpImportStatus | null> => {
      const apiUrl = localStorageGet('api_url');
      const token = localStorageGet('token');

      if (!apiUrl || !token) return null;

      return getIdpImportStatus(apiUrl, token);
    };

    (async () => {
      const deadline = Date.now() + POLL_TIMEOUT_MS;
      let current = await read();

      if (cancelled) return;

      setStatus(current);

      // A backend that cannot answer must not strand anyone here.
      if (!current || current.ready) {
        setPhase('clear');

        return;
      }

      if (current.status === 'failed') {
        setPhase('failed');

        return;
      }

      sawImport.current = true;
      setPhase('importing');

      while (!cancelled && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

        if (cancelled) return;

        current = await read();
        setStatus(current);

        if (!current) {
          setPhase('clear');

          return;
        }

        if (current.status === 'failed') {
          setPhase('failed');

          return;
        }

        if (current.ready) {
          // Waited for it, so say so rather than blinking straight through.
          setPhase(sawImport.current ? 'done' : 'clear');

          return;
        }
      }

      if (!cancelled) setPhase('clear');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { phase, status, dismiss };
};
