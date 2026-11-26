import { PhaseType } from '@/types/SettingsTypes';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import ProgressBar from '@/v2/components/ui/ProgressBar';
import { useTranslation } from 'react-i18next';

type Metric = 'likes' | 'votes';

const METRICS: Record<Metric, { icon: ICON_TYPE; label: string }> = {
  likes: { icon: 'heart', label: 'v2.scopes.ideas.stats.likeTurnout' },
  votes: { icon: 'voting', label: 'v2.scopes.ideas.stats.voteTurnout' },
};

interface QuorumBarProps {
  metric: Metric;
  count: number;
  /** Renders nothing when 0. */
  users: number;
  /** Percentage; 0 hides the marker. */
  quorum?: number;
  color: PhaseType;
  className?: string;
}

const QuorumBar = ({ metric, count, users, quorum = 0, color, className }: QuorumBarProps) => {
  const { t } = useTranslation();

  // The API sends strings, or omits them.
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
