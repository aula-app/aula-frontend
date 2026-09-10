import Alert, { AlertSeverity } from '@/v2/components/ui/Alert';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useIdpSyncEntry } from './useIdpSyncEntry';

const ACTION_CLASS =
  'rounded-full px-4 py-1.5 text-sm font-bold bg-primary text-text-primary ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * The migration, on the page an admin already goes to.
 *
 * It shows itself only once an operator has flagged the school in aula-manager,
 * and then says where the school actually is rather than that something is
 * happening somewhere. Each step asks for its own next action in place; the
 * review is the one that needs a screen of its own.
 */
const IdpSyncEntry: React.FC = () => {
  const { t } = useTranslation();
  const { status, progress, busy, failed, connect, prepare, refresh } = useIdpSyncEntry();

  if (!status) return null;

  const button = (label: string, onClick: () => void, testId: string) => (
    <button type="button" className={ACTION_CLASS} disabled={busy} onClick={onClick} data-testid={testId}>
      {label}
    </button>
  );

  const step: { severity: AlertSeverity; action?: ReactNode } = {
    flagged: {
      severity: 'info' as const,
      action: button(t('v2.ui.idpSync.actions.connect'), connect, 'idp-sync-connect'),
    },
    connected: {
      severity: 'info' as const,
      action: button(t('v2.ui.idpSync.actions.prepare'), prepare, 'idp-sync-prepare'),
    },
    reviewing: {
      severity: 'warning' as const,
      action: (
        <Link to="/settings/idp-sync" className={ACTION_CLASS} data-testid="config-idp-sync-open">
          {t('v2.ui.idpSync.actions.open')}
        </Link>
      ),
    },
    importing: { severity: 'info' as const },
    linking: {
      severity: 'info' as const,
      action: button(t('v2.ui.idpSync.actions.refresh'), refresh, 'idp-sync-refresh'),
    },
    completed: { severity: 'success' as const },
  }[status];

  // Only the steps the admin can act on are announced as needing them.
  const needsAction = status === 'flagged' || status === 'connected' || status === 'reviewing';

  return (
    <Alert
      severity={step.severity}
      eyebrow={needsAction ? t('v2.ui.idpSync.actionNeeded') : undefined}
      title={t(`v2.ui.idpSync.states.${status}.title`)}
      action={step.action}
      className="mb-2"
      data-testid="config-idp-sync-entry"
    >
      <span data-testid="config-idp-sync-status">
        {t(`v2.ui.idpSync.states.${status}.body`, {
          linked: progress?.linked ?? 0,
          remaining: progress?.not_yet_linked ?? 0,
        })}
      </span>
      {!!failed && <p className="mt-2 font-bold">{t(`v2.ui.idpSync.errors.${failed}`)}</p>}
    </Alert>
  );
};

export default IdpSyncEntry;
