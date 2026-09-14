import {
  applyProposal,
  buildProposal,
  CandidateKind,
  getMigrationProgress,
  getProposal,
  MergeCandidate,
  MigrationProgress,
  saveDecisions,
  startIdpConnect,
} from '@/services/idpMigration';
import { completeSsoLink } from '@/services/sso';
import { localStorageGet } from '@/utils';
import Icon from '@/components/new/Icon/Icon';
import Button from '@/v2/components/button/Button';
import Alert from '@/v2/components/ui/Alert';
import Dialog from '@/v2/components/ui/Dialog';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import { useCallback, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ReviewTable from './ReviewTable';

const PER_PAGE = 50;

const IMPORT_POLL_MS = 3000;

const IdpSyncView: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Outlives `asking` so the dialog keeps its text while it animates out.
  const [confirming, setConfirming] = useState<'apply' | 'reset' | null>(null);
  const [asking, setAsking] = useState(false);
  const confirmBodyId = useId();

  const ask = (kind: 'apply' | 'reset') => {
    setConfirming(kind);
    setAsking(true);
  };

  const [rows, setRows] = useState<Record<CandidateKind, MergeCandidate[]>>({ room: [], user: [] });
  const [totals, setTotals] = useState<Record<CandidateKind, number>>({ room: 0, user: 0 });
  const [pages, setPages] = useState<Record<CandidateKind, number>>({ room: 1, user: 1 });
  const [search, setSearch] = useState<Record<CandidateKind, string>>({ room: '', user: '' });

  const refreshProgress = useCallback(async () => {
    setProgress(await getMigrationProgress());
  }, []);

  const loadKind = useCallback(
    async (kind: CandidateKind) => {
      const page = await getProposal({ kind, page: pages[kind], search: search[kind], perPage: PER_PAGE });

      if (!page) return;

      setRows((current) => ({ ...current, [kind]: page.data }));
      setTotals((current) => ({ ...current, [kind]: page.total }));
    },
    [pages, search]
  );

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useEffect(() => {
    if (progress?.migration_status === 'reviewing') {
      loadKind('room');
      loadKind('user');
    }
  }, [progress?.migration_status, loadKind]);

  useEffect(() => {
    if (progress?.migration_status !== 'importing') return;

    const timer = setInterval(refreshProgress, IMPORT_POLL_MS);

    return () => clearInterval(timer);
  }, [progress?.migration_status, refreshProgress]);

  useEffect(() => {
    const linkToken = searchParams.get('sso_link');

    if (!linkToken) return;

    const apiUrl = localStorageGet('api_url') ?? '';
    const jwt = localStorageGet('token') ?? '';

    completeSsoLink(apiUrl, linkToken, jwt).then(async (result) => {
      // Spent either way; left in the URL it turns every reload into a failed retry.
      setSearchParams({}, { replace: true });

      const current = await getMigrationProgress();
      setProgress(current);

      // A redeemed token reads as missing on reload, so trust the tenant's state.
      if (!result.success && current?.migration_status === 'flagged') {
        setError(t(`errors.sso.${result.error}`, t('v2.ui.idpSync.errors.connect')));

        return;
      }

      setNotice(t('v2.ui.idpSync.connectReturned'));
    });
  }, [searchParams, setSearchParams, t]);

  const connect = async () => {
    setBusy(true);
    const url = await startIdpConnect();
    setBusy(false);

    if (!url) {
      setError(t('v2.ui.idpSync.errors.connect'));

      return;
    }

    window.location.href = url;
  };

  const prepare = async () => {
    setBusy(true);
    setError(null);
    setAsking(false);
    const counts = await buildProposal();
    setBusy(false);

    if (!counts) {
      setError(t('v2.ui.idpSync.errors.prepare'));

      return;
    }

    await refreshProgress();
  };

  // The save reports only success, so reload rather than guess what became of
  // the row the record came from.
  const assign = async (row: MergeCandidate, localId: number | null) => {
    await saveDecisions([{ id: row.id, decision: localId === null ? null : 'merge', local_id: localId }]);
    await loadKind(row.kind);
  };

  const apply = async () => {
    setBusy(true);
    setError(null);
    setAsking(false);
    const result = await applyProposal();
    setBusy(false);

    if (!result.ok) {
      setError(t('v2.ui.idpSync.errors.apply', { count: Object.keys(result.problems).length }));

      return;
    }

    await refreshProgress();
  };

  const status = progress?.migration_status ?? null;

  const table = (kind: CandidateKind) => (
    <ReviewTable
      kind={kind}
      rows={rows[kind]}
      total={totals[kind]}
      page={pages[kind]}
      perPage={PER_PAGE}
      search={search[kind]}
      onSearch={(value) => setSearch((current) => ({ ...current, [kind]: value }))}
      onPage={(page) => setPages((current) => ({ ...current, [kind]: page }))}
      onAssign={assign}
    />
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2 sm:p-4 gap-4" data-testid="idp-sync-view">
      <h1 className="flex items-center gap-2">
        <Icon type="cloudSync" />
        {t('v2.ui.idpSync.title')}
      </h1>

      {!!error && <Alert severity="error">{error}</Alert>}
      {!!notice && <Alert severity="info">{notice}</Alert>}

      {status === null && (
        <FeedbackState
          image="/img/Paula_schlafend.svg"
          alt={t('v2.alt.sleeping')}
          title={t('v2.ui.idpSync.title')}
          description={t('v2.ui.idpSync.notEnabled')}
          data-testid="idp-sync-not-enabled"
        />
      )}

      {status === 'flagged' && (
        <section className="flex flex-col items-start gap-3">
          <p>{t('v2.ui.idpSync.step.connect')}</p>
          <Button disabled={busy} onClick={connect} data-testid="idp-sync-connect">
            {t('v2.ui.idpSync.actions.connect')}
          </Button>
        </section>
      )}

      {status === 'connected' && (
        <section className="flex flex-col items-start gap-3">
          <p>{t('v2.ui.idpSync.step.prepare')}</p>
          <Button disabled={busy} onClick={prepare} data-testid="idp-sync-prepare">
            {t('v2.ui.idpSync.actions.prepare')}
          </Button>
        </section>
      )}

      {status === 'reviewing' && (
        <div className="flex flex-col gap-6">
          <p className="text-sm opacity-70">{t('v2.ui.idpSync.guide')}</p>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl">{t('v2.ui.idpSync.rooms')}</h2>
            {table('room')}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl">{t('v2.ui.idpSync.users')}</h2>
            {table('user')}
          </section>

          <div className="flex flex-wrap items-center gap-2">
            <Button disabled={busy} onClick={() => ask('apply')} data-testid="idp-sync-apply">
              {t('v2.ui.idpSync.actions.apply')}
            </Button>
            <Button
              text
              color="error"
              className="ml-auto"
              disabled={busy}
              onClick={() => ask('reset')}
              data-testid="idp-sync-reset"
            >
              {t('v2.ui.idpSync.actions.reset')}
            </Button>
          </div>

          <Dialog
            open={asking}
            onClose={() => setAsking(false)}
            onExited={() => setConfirming(null)}
            role="alertdialog"
            describedBy={confirmBodyId}
            title={t(`v2.ui.idpSync.actions.${confirming ?? 'apply'}`)}
          >
            <div className="flex flex-col gap-4 p-6" data-testid={`idp-sync-confirm-${confirming}`}>
              <h2 className="text-xl">{t(`v2.ui.idpSync.actions.${confirming ?? 'apply'}`)}</h2>
              <p id={confirmBodyId} className="text-sm">
                {t(confirming === 'reset' ? 'v2.ui.idpSync.resetWarning' : 'v2.ui.idpSync.reviewWarning')}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  text
                  color="error"
                  className="mr-auto"
                  disabled={busy}
                  onClick={() => setAsking(false)}
                  data-testid="idp-sync-confirm-cancel"
                >
                  {t('actions.cancel')}
                </Button>
                <Button
                  color={confirming === 'reset' ? 'error' : undefined}
                  disabled={busy}
                  onClick={confirming === 'reset' ? prepare : apply}
                  data-testid={`idp-sync-${confirming}-confirm`}
                >
                  {t(`v2.ui.idpSync.actions.${confirming ?? 'apply'}`)}
                </Button>
              </div>
            </div>
          </Dialog>
        </div>
      )}

      {(status === 'importing' || status === 'linking' || status === 'completed') && (
        <section className="flex flex-col items-start gap-3">
          {status === 'importing' && (
            <p role="status" className="flex items-center gap-2">
              <span aria-hidden="true">…</span>
              {t('v2.ui.idpSync.step.importing')}
            </p>
          )}

          <h2 className="text-xl">{t('v2.ui.idpSync.progressTitle')}</h2>
          <p data-testid="idp-sync-progress">
            {t('v2.ui.idpSync.progressBody', {
              linked: progress?.linked ?? 0,
              remaining: progress?.not_yet_linked ?? 0,
            })}
          </p>
          <p className="text-sm opacity-70">{t('v2.ui.idpSync.progressHint')}</p>
          <Button outlined onClick={refreshProgress} data-testid="idp-sync-refresh">
            {t('v2.ui.idpSync.actions.refresh')}
          </Button>
        </section>
      )}
    </div>
  );
};

export default IdpSyncView;
