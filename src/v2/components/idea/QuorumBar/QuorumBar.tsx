import { PhaseType } from '@/types/SettingsTypes';
import Icon from '@/v2/components/ui/Icon/Icon';
import ProgressBar from '@/v2/components/ui/ProgressBar';
import { useTranslation } from 'react-i18next';

interface QuorumBarProps {
  /** Votes cast on this idea. */
  votes: number;
  /** Eligible voters. Renders nothing when zero — there is no share to draw. */
  users: number;
  /** Share of eligible voters required, as a percentage. 0 hides the marker. */
  quorum?: number;
  /** Phase palette the bar is drawn in. */
  color: PhaseType;
  className?: string;
}

/** Turnout on an idea drawn against the quorum it has to clear. */
const QuorumBar = ({ votes, users, quorum = 0, color, className }: QuorumBarProps) => {
  const { t } = useTranslation();

  if (users <= 0) return null;

  return (
    <ProgressBar
      value={(votes / users) * 100}
      color={color}
      label={t('v2.scopes.ideas.stats.turnout', { votes, total: users })}
      marker={quorum > 0 ? quorum : undefined}
      markerLabel={quorum > 0 ? Math.ceil((quorum / 100) * users) : undefined}
      valueLabel={<span className="pl-5">{votes}</span>}
      endLabel={users}
      className={className}
    >
      <Icon type="voting" size="1rem" />
    </ProgressBar>
  );
};

export default QuorumBar;
