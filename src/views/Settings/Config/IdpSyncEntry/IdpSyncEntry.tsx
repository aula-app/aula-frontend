import Icon from '@/components/new/Icon/Icon';
import Alert, { AlertSeverity } from '@/v2/components/ui/Alert';
import Button from '@/v2/components/button/Button';
import Stepper from '@/v2/components/ui/Stepper';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdpSyncEntry } from './useIdpSyncEntry';

const STEPS = ['connect', 'review', 'merged'] as const;

const STEP_INDEX: Record<string, number> = {
  flagged: 0,
  connected: 1,
  reviewing: 1,
  importing: 2,
  linking: 2,
  completed: 2,
};

const IdpSyncEntry: React.FC = () => {
  const { t } = useTranslation();
  const { status, progress, busy, failed, connect } = useIdpSyncEntry();

  if (!status) return null;

  const openReview = (
    <Button to="/settings/idp-sync" className="rounded-full" data-testid="config-idp-sync-open">
      {t('v2.ui.idpSync.actions.open')}
    </Button>
  );

  const step: { severity: AlertSeverity; action?: ReactNode } = {
    flagged: {
      severity: 'info' as const,
      action: (
        <Button type="button" className="rounded-full" disabled={busy} onClick={connect} data-testid="idp-sync-connect">
          {t('v2.ui.idpSync.actions.connect')}
        </Button>
      ),
    },
    connected: { severity: 'info' as const, action: openReview },
    reviewing: { severity: 'warning' as const, action: openReview },
    importing: { severity: 'success' as const },
    linking: { severity: 'success' as const },
    completed: { severity: 'success' as const },
  }[status];

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
        {!!failed && <p className="mt-2 font-bold">{t(`v2.ui.idpSync.errors.${failed}.title`)}</p>}
      </Alert>
    </section>
  );
};

export default IdpSyncEntry;
