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
import { Alert, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ReviewTable from './ReviewTable';

const PER_PAGE = 50;

/**
 * Moving a school that already uses aula onto its identity provider.
 *
 * The screen follows the tenant's own state rather than keeping its own: an
 * admin can leave halfway through, come back days later, and pick up where the
 * school actually is.
 */
const IdpSyncView: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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

  // Coming back from the provider, the connect flow leaves a one-shot token in
  // the URL. The admin is already signed in here, so the token is redeemed
  // against their session: asking them for the aula password they just used
  // would prove nothing. A password belongs to the other flow, where someone
  // arrives from the provider with no aula session at all.
  useEffect(() => {
    const linkToken = searchParams.get('sso_link');

    if (!linkToken) return;

    const apiUrl = localStorageGet('api_url') ?? '';
    const jwt = localStorageGet('token') ?? '';

    completeSsoLink(apiUrl, linkToken, jwt).then((result) => {
      if (!result.success) {
        setError(t(`errors.sso.${result.error}`, t('idp.sync.errors.connect')));

        return;
      }

      setNotice(t('idp.sync.connectReturned'));
      // Drop the one-shot token so a reload does not retry a spent link.
      setSearchParams({}, { replace: true });
      refreshProgress();
    });
  }, [searchParams, setSearchParams, t, refreshProgress]);

  const connect = async () => {
    setBusy(true);
    const url = await startIdpConnect();
    setBusy(false);

    if (!url) {
      setError(t('idp.sync.errors.connect'));

      return;
    }

    window.location.href = url;
  };

  const prepare = async () => {
    setBusy(true);
    setError(null);
    const counts = await buildProposal();
    setBusy(false);

    if (!counts) {
      setError(t('idp.sync.errors.prepare'));

      return;
    }

    await refreshProgress();
  };

  const toggle = async (row: MergeCandidate, merge: boolean) => {
    const decision = merge ? 'merge' : null;

    setRows((current) => ({
      ...current,
      [row.kind]: current[row.kind].map((item) => (item.id === row.id ? { ...item, decision } : item)),
    }));

    await saveDecisions([{ id: row.id, decision }]);
  };

  const apply = async () => {
    setBusy(true);
    setError(null);
    const result = await applyProposal();
    setBusy(false);

    if (!result.ok) {
      // The backend refuses a proposal that would fold two people into one
      // account, and refuses it whole rather than applying part of it.
      setError(t('idp.sync.errors.apply', { count: Object.keys(result.problems).length }));

      return;
    }

    await refreshProgress();
  };

  const status = progress?.migration_status ?? null;

  return (
    <Stack gap={3} p={3} data-testid="idp-sync-view">
      <Typography variant="h5">{t('idp.sync.title')}</Typography>

      {!!error && <Alert severity="error">{error}</Alert>}
      {!!notice && <Alert severity="info">{notice}</Alert>}

      {status === null && <Alert severity="info">{t('idp.sync.notEnabled')}</Alert>}

      {status === 'flagged' && (
        <Stack gap={2} alignItems="flex-start">
          <Typography>{t('idp.sync.step.connect')}</Typography>
          <Button variant="contained" disabled={busy} onClick={connect} data-testid="idp-sync-connect">
            {t('idp.sync.actions.connect')}
          </Button>
        </Stack>
      )}

      {status === 'connected' && (
        <Stack gap={2} alignItems="flex-start">
          <Typography>{t('idp.sync.step.prepare')}</Typography>
          <Button variant="contained" disabled={busy} onClick={prepare} data-testid="idp-sync-prepare">
            {t('idp.sync.actions.prepare')}
          </Button>
        </Stack>
      )}

      {status === 'reviewing' && (
        <Stack gap={4}>
          <Alert severity="warning">{t('idp.sync.reviewWarning')}</Alert>

          <Stack gap={1}>
            <Typography variant="h6">{t('idp.sync.rooms')}</Typography>
            <ReviewTable
              kind="room"
              rows={rows.room}
              total={totals.room}
              page={pages.room}
              perPage={PER_PAGE}
              search={search.room}
              onSearch={(value) => setSearch((c) => ({ ...c, room: value }))}
              onPage={(page) => setPages((c) => ({ ...c, room: page }))}
              onToggle={toggle}
            />
          </Stack>

          <Divider />

          <Stack gap={1}>
            <Typography variant="h6">{t('idp.sync.users')}</Typography>
            <ReviewTable
              kind="user"
              rows={rows.user}
              total={totals.user}
              page={pages.user}
              perPage={PER_PAGE}
              search={search.user}
              onSearch={(value) => setSearch((c) => ({ ...c, user: value }))}
              onPage={(page) => setPages((c) => ({ ...c, user: page }))}
              onToggle={toggle}
            />
          </Stack>

          <Stack direction="row" gap={2}>
            <Button variant="contained" color="success" disabled={busy} onClick={apply} data-testid="idp-sync-apply">
              {t('idp.sync.actions.apply')}
            </Button>
            <Button disabled={busy} onClick={prepare} data-testid="idp-sync-rebuild">
              {t('idp.sync.actions.rebuild')}
            </Button>
          </Stack>
        </Stack>
      )}

      {(status === 'importing' || status === 'linking' || status === 'completed') && (
        <Stack gap={2}>
          {status === 'importing' && (
            <Stack direction="row" gap={2} alignItems="center">
              <CircularProgress size={20} />
              <Typography>{t('idp.sync.step.importing')}</Typography>
            </Stack>
          )}

          <Typography variant="h6">{t('idp.sync.progressTitle')}</Typography>
          <Typography data-testid="idp-sync-progress">
            {t('idp.sync.progressBody', {
              linked: progress?.linked ?? 0,
              remaining: progress?.not_yet_linked ?? 0,
            })}
          </Typography>
          {/* The remaining count is what says whether the migration is done,
              and therefore whether password login can safely be switched off. */}
          <Typography variant="body2" color="text.secondary">
            {t('idp.sync.progressHint')}
          </Typography>
          <Button onClick={refreshProgress} data-testid="idp-sync-refresh">
            {t('idp.sync.actions.refresh')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default IdpSyncView;
