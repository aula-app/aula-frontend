import { RoomPhases } from '@/types/SettingsTypes';
import { phases } from '@/utils';
import Link from '@/v2/components/navigation/Link';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';

interface PhaseCountLinkProps {
  phase: `${RoomPhases}`;
  /** Ideas the user has in this phase. Omitted while it loads. */
  count?: number;
}

const PhaseCountLink = ({ phase, count }: PhaseCountLinkProps) => {
  const { t } = useTranslation();
  const phaseType = phases[phase];
  const name = t(`phases.${phaseType}`);
  const noun = t(`v2.scopes.ideas.${count === 1 ? 'singular' : 'plural'}`);

  return (
    <Link
      to={`/phase/${phase}`}
      aria-label={count === undefined ? name : `${name} - ${count} ${noun}`}
      data-testid={`dashboard-phase-${phase}`}
      className={`flex min-h-10 items-center gap-2 rounded-full px-4 py-2 no-underline hover:no-underline focus-visible:outline-offset-2 bg-${phaseType} hover:bg-${phaseType}-active active:bg-${phaseType}-active transition-colors duration-150`}
    >
      <Icon type={phaseType} size="1.25rem" className="shrink-0" />
      <span className="flex-1 truncate">{name}</span>
      {count !== undefined && <span className="font-medium">{count}</span>}
    </Link>
  );
};

export default PhaseCountLink;
