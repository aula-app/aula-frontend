import { RoomPhases } from '@/types/SettingsTypes';
import ActivityLink from '@/v2/components/dashboard/ActivityLink';
import PhaseCountLink from '@/v2/components/dashboard/PhaseCountLink';
import Alert from '@/v2/components/ui/Alert';
import Collapse from '@/v2/components/ui/Collapse';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useMessageCount, useUpdateCount } from '@/v2/hooks/useActivityCounts';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useDashboard } from './useDashboard';

const DASHBOARD_PHASES: `${RoomPhases}`[] = ['0', '10', '20', '30'];

interface DashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Dashboard = ({ open, onOpenChange }: DashboardProps) => {
  const { t } = useTranslation();
  const { counts, error } = useDashboard();
  const messageCount = useMessageCount();
  const updateCount = useUpdateCount();
  const headingId = useId();
  const panelId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col p-2 sm:p-4 sm:pb-2 bg-shadow m-2 mb-0 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <h2 id={headingId} className="min-w-0">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => onOpenChange(!open)}
            data-testid="dashboard-toggle"
            className="flex cursor-pointer items-center gap-2 rounded-lg pl-2"
          >
            <span className="truncate">{t('v2.ui.dashboard.title')}</span>
            <Icon
              type="chevronDown"
              size=".75em"
              className={twMerge('shrink-0 transition-transform duration-200 ease-in-out', !open && 'rotate-180')}
            />
          </button>
        </h2>
        <nav aria-label={t('v2.ui.dashboard.title')} className="flex shrink-0 items-center gap-1">
          <ActivityLink
            to="/messages"
            icon="message"
            label={t('ui.navigation.messages')}
            count={messageCount}
            badgeClass="bg-info text-info-fg"
          />
          <ActivityLink
            to="/updates"
            icon="bell"
            label={t('ui.navigation.updates')}
            count={updateCount}
            badgeClass="bg-discussion text-discussion-fg"
          />
        </nav>
      </div>
      <Collapse open={open} id={panelId}>
        {error ? (
          <Alert severity="error" title={t('v2.ui.error.fetch.title')} className="my-2" />
        ) : (
          <ul className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-4">
            {DASHBOARD_PHASES.map((phase) => (
              <li key={phase}>
                <PhaseCountLink phase={phase} count={counts?.[phase]} />
              </li>
            ))}
          </ul>
        )}
      </Collapse>
    </section>
  );
};

export default Dashboard;
