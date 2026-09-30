import Icon from '@/components/new/Icon/Icon';
import Alert, { AlertSeverity } from '@/v2/components/ui/Alert';
import Stepper from '@/v2/components/ui/Stepper';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useIdpSyncEntry } from './useIdpSyncEntry';

const STEPS = ['connect', 'prepare', 'review', 'import'] as const;

/** The last three statuses are all the import running its course. */
const STEP_INDEX: Record<string, number> = {
  flagged: 0,
  connected: 1,
  reviewing: 2,
  importing: 3,
  linking: 3,
  // Past the last step: nothing is in hand any more, so every step reads as done.
  completed: STEPS.length,
};

/**
 * The merge screen is not ready to ship: a deployed build shows the steps and
 * their copy, but cannot start or open the review, or a school would be moved
 * into `reviewing` with no way through it.
 */
const REVIEW_ENABLED = import.meta.env.DEV;

// inline-flex, not the default: an <a> is display:inline, where vertical padding
// does not grow the box, so the Link would sit tighter than the <button>s.
const ACTION_CLASS =
  'inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold ' +
  'bg-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed';

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

  const button = (label: string, onClick: () => void, testId: string, enabled = true) => (
    <button type="button" className={ACTION_CLASS} disabled={busy || !enabled} onClick={onClick} data-testid={testId}>
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
      action: button(t('v2.ui.idpSync.actions.prepare'), prepare, 'idp-sync-prepare', REVIEW_ENABLED),
    },
    reviewing: {
      severity: 'warning' as const,
      action: REVIEW_ENABLED ? (
        <Link to="/settings/idp-sync" className={ACTION_CLASS} data-testid="config-idp-sync-open">
          {t('v2.ui.idpSync.actions.open')}
        </Link>
      ) : (
        <button type="button" className={ACTION_CLASS} disabled data-testid="config-idp-sync-open">
          {t('v2.ui.idpSync.actions.open')}
        </button>
      ),
    },
    // The import and everything after it: the risky decisions are already behind.
    importing: { severity: 'success' as const },
    linking: {
      severity: 'success' as const,
      action: button(t('v2.ui.idpSync.actions.refresh'), refresh, 'idp-sync-refresh'),
    },
    completed: { severity: 'success' as const },
  }[status];

  // Only the steps the admin can act on are announced as needing them.
  const needsAction = status === 'flagged' || status === 'connected' || status === 'reviewing';

  return (
    <section className="mb-4 gap-2 flex flex-col">
      <h2 className="flex items-center gap-2 text-2xl!">
        <Icon type="cloudSync" />
        {t('v2.ui.idpSync.title')}
      </h2>
      <Alert
        severity={step.severity}
        eyebrow={needsAction ? t('v2.ui.idpSync.actionNeeded') : undefined}
        title={t(`v2.ui.idpSync.states.${status}.title`)}
        action={step.action}
        header={
          <Stepper
            steps={STEPS.map((step) => t(`v2.ui.idpSync.stepper.${step}`))}
            current={STEP_INDEX[status]}
            label={t('v2.ui.idpSync.stepper.label')}
            data-testid="idp-sync-stepper"
          />
        }
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
    </section>
  );
};

export default IdpSyncEntry;
