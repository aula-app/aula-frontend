import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { VoteResultsState } from './useVoteResults';

type Tone = 'success' | 'warning' | 'error' | 'neutral';

interface VoteResultsProps {
  /** Distribution from `useVoteResults`. Null while it loads, and the track stays hidden. */
  results: VoteResultsState | null;
  /** Eligible voters, used when the stats endpoint sends none — an idea with no votes at all. */
  users?: number;
  /** Corner radius is the caller's, since the track sits between other bands. */
  className?: string;
}

/** How an idea polled, as one track split between the options and the voters who never turned up. */
const VoteResults = ({ results, users = 0, className }: VoteResultsProps) => {
  const { t } = useTranslation();

  if (!results) return null;
  const { counts, total, voters } = results;

  // Votes carry a weight, so their sum can outrun the head count. Widening the scale keeps the
  // segments inside the track and the non-voter share at zero rather than negative.
  const eligible = Math.max(voters || Number(users) || 0, total);
  if (eligible <= 0) return null;

  const segments: { tone: Tone; icon: ICON_TYPE; count: number; name: string }[] = [
    { tone: 'success', icon: 'for', count: counts.for, name: t('votes.for') },
    { tone: 'warning', icon: 'neutral', count: counts.neutral, name: t('votes.neutral') },
    { tone: 'error', icon: 'against', count: counts.against, name: t('votes.against') },
    { tone: 'neutral', icon: 'clock', count: eligible - total, name: t('v2.scopes.ideas.stats.notVoted') },
  ];

  return (
    <div
      role="group"
      aria-label={t('v2.scopes.ideas.stats.voteTurnout', { num: total, total: eligible })}
      className={twMerge('flex overflow-hidden', className)}
    >
      {segments
        .filter(({ count }) => count > 0)
        .map(({ tone, icon, count, name }) => (
          <span
            key={tone}
            style={{ width: `${(count / eligible) * 100}%` }}
            className={twMerge(
              'flex items-center justify-center gap-1 overflow-hidden whitespace-nowrap px-1 py-1.5 text-xs font-semibold',
              `bg-${tone} text-${tone}-fg`
            )}
          >
            <Icon type={icon} size="1rem" aria-hidden="true" />
            <span aria-hidden="true">{count}</span>
            <span className="sr-only">{`${name}: ${count}`}</span>
          </span>
        ))}
    </div>
  );
};

export default VoteResults;
