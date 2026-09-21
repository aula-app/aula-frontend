import { Vote, votingOptions } from '@/utils';
import DecisionBar from '@/v2/components/idea/DecisionBar';
import { useTranslation } from 'react-i18next';
import { VoteState } from './useIdeaVote';

/** Chosen option's fill, matching the status chip the vote produces. */
const CHOSEN: Record<(typeof votingOptions)[number], string> = {
  against: 'bg-error text-error-fg hover:bg-error-active',
  neutral: 'bg-neutral text-neutral-fg hover:bg-neutral-active',
  for: 'bg-success text-success-fg hover:bg-success-active',
};

interface VoteBarProps {
  /** Vote state from `useIdeaVote`, owned by the caller so the status chip reads the same value. */
  vote: VoteState;
  /** Shows the options without letting them be cast, for viewers with no vote of their own. */
  disabled?: boolean;
  /** Corner radius is the caller's, since the bar sits between other bands. */
  className?: string;
}

/** The three voting options as one band: against, neutral and for. */
const VoteBar = ({ vote: { vote, cast }, disabled = false, className }: VoteBarProps) => {
  const { t } = useTranslation();

  return (
    <DecisionBar
      label={t('votes.vote')}
      options={votingOptions.map((option, index) => ({
        value: (index - 1) as Vote,
        icon: option,
        label: t(`votes.${option}`),
        colors: CHOSEN[option],
        testId: option,
      }))}
      value={vote}
      onChange={cast}
      disabled={disabled}
      className={className}
    />
  );
};

export default VoteBar;
