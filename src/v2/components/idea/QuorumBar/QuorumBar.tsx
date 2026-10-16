import { StatusTone } from '@/v2/components/idea/PhaseStatus/getPhaseStatus';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import ProgressBar from '@/v2/components/ui/ProgressBar';
import { useTranslation } from 'react-i18next';

type Metric = 'likes' | 'votes';

const METRICS: Record<Metric, { icon: ICON_TYPE; label: string }> = {
  likes: { icon: 'heart', label: 'v2.scopes.ideas.stats.likeTurnout' },
  votes: { icon: 'voting', label: 'v2.scopes.ideas.stats.voteTurnout' },
};

interface QuorumBarProps {
  /** Participation the bar measures: likes before voting opens, votes after. */
  metric: Metric;
  /** Likes or votes the idea has drawn. */
  count: number;
  /** Eligible participants. Renders nothing when zero — there is no share to draw. */
  users: number;
  /** Share of participants required, as a percentage. 0 hides the marker. */
  quorum?: number;
  /** Palette the bar is drawn in — the idea's status tone, so bar and badge agree. */
  color: StatusTone;
  className?: string;
}

/** Participation on an idea drawn against the quorum it has to clear. */
const QuorumBar = ({ metric, count, users, quorum = 0, color, className }: QuorumBarProps) => {
  const { t } = useTranslation();

  // The API sends these as strings, and omits them entirely on some idea endpoints.
  const total = Number(users) || 0;
  const reached = Number(count) || 0;

  if (total <= 0) return null;

  const { icon, label } = METRICS[metric];

  return (
    <ProgressBar
      value={(reached / total) * 100}
      color={color}
      label={t(label, { num: reached, total })}
      marker={quorum > 0 ? quorum : undefined}
      markerLabel={quorum > 0 ? Math.ceil((quorum / 100) * total) : undefined}
      valueLabel={reached}
      endLabel={total}
      className={className}
    >
      <Icon type={icon} size="1rem" />
    </ProgressBar>
  );
};

export default QuorumBar;
