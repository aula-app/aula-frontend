import Icon from '@/components/new/Icon/Icon';
import Alert, { AlertSeverity } from '@/v2/components/ui/Alert';
import Button from '@/v2/components/button/Button';
import Stepper from '@/v2/components/ui/Stepper';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdpSyncEntry } from './useIdpSyncEntry';

const STEPS = ['connect', 'prepare', 'review', 'import'] as const;

/** The last three statuses are all the import running its course. */
const STEP_INDEX: Record<string, number> = {
  flagged: 0,
  connected: 1,
  reviewing: 2,
  importing: 3,
  linking: 3,
  completed: STEPS.length,
};

const IdpSyncEntry: React.FC = () => {
  const { t } = useTranslation();
  const { status: liveStatus, progress, busy, failed, connect, prepare, refresh } = useIdpSyncEntry();
  const status = liveStatus;

  if (!status) return null;

  const button = (label: string, onClick: () => void, testId: string) => (
    <Button type="button" className="rounded-full" disabled={busy} onClick={onClick} data-testid={testId}>
      {label}
    </Button>
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
        <Button to="/settings/idp-sync" className="rounded-full" data-testid="config-idp-sync-open">
          {t('v2.ui.idpSync.actions.open')}
        </Button>
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
