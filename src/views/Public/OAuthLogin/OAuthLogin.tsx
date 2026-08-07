import { getIdpImportStatus, IdpImportStatus } from '@/services/sso';
import { useAppStore } from '@/store';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { localStorageGet } from '@/utils';
import SchoolSetupView from '../SchoolSetupView';

/** How often to ask the backend whether the school import has finished. */
const POLL_INTERVAL_MS = 2000;

/**
 * Give up waiting after this long and let the user in anyway.
 *
 * A stuck import must not lock a school out of aula permanently; the rooms and
 * users appear as the queue catches up.
 */
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

const OAuthLogin = () => {
  const { jwt_token } = useParams<{ jwt_token?: string }>();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();
  const [importStatus, setImportStatus] = useState<IdpImportStatus | null>(null);
  const [waiting, setWaiting] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    (async () => {
      try {
        // IdP-initiated launches (e.g. Eduplaces marketplace) start without
        // an instance code in localStorage. The backend now passes the
        // resolved tenant back as `?code=…`; populate localStorage before
        // entering the app or every subsequent request will be tenantless.
        const codeFromUrl = searchParams.get('code');
        const codeInStorage = localStorageGet('code');
        if (codeFromUrl && codeFromUrl !== codeInStorage) {
          await validateAndSaveInstanceCode(codeFromUrl);
        }

        handleOAuthLogin(jwt_token);
        localStorage.removeItem('sso_force_login');

        await waitForSchool();

        if (cancelled.current) return;

        dispatch({ type: 'LOG_IN' });
        navigate('/', { replace: true });
      } catch (error) {
        navigate('/login', { replace: true });
      }
    })();

    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt_token, searchParams, dispatch, navigate]);

  /**
   * Hold here until the school's directory import has finished.
   *
   * The very first login at a school queues an import of all its rooms and
   * users. Everyone after that finds their account already there, so this only
   * ever waits once per school. Schools that sync from no directory report
   * ready immediately and fall straight through.
   */
  async function waitForSchool(): Promise<void> {
    const apiUrl = localStorageGet('api_url');
    const token = localStorageGet('token');

    if (!apiUrl || !token) return;

    const deadline = Date.now() + POLL_TIMEOUT_MS;

    // A first read before showing anything, so a school that is already set up
    // never flashes the waiting screen.
    let status = await getIdpImportStatus(apiUrl, token);

    if (!status || status.ready) return;

    setImportStatus(status);
    setWaiting(true);

    while (!cancelled.current && Date.now() < deadline) {
      if (status?.status === 'failed') return;

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      if (cancelled.current) return;

      status = await getIdpImportStatus(apiUrl, token);
      setImportStatus(status);

      // A backend that stops answering should not trap the user here.
      if (!status || status.ready) return;
    }
  }

  return waiting ? <SchoolSetupView status={importStatus} /> : null;
};

export default OAuthLogin;
