import DecisionBar from '@/v2/components/idea/DecisionBar';
import { useTranslation } from 'react-i18next';
import { Verdict } from '@/utils';
import { WinnerState } from './useIdeaWinner';

const CHOSEN_AGAINST = 'bg-error text-error-fg hover:bg-error-active';
const CHOSEN_FOR = 'bg-success text-success-fg hover:bg-success-active';

interface WinnerBarProps {
  /** Verdict state from `useIdeaWinner`, owned by the caller so the status chip reads the same value. */
  winner: WinnerState;
  /** Corner radius is the caller's, since the bar sits between other bands. */
  className?: string;
}

/** The results-phase verdict as one band: winner, or not selected. No middle ground. */
const WinnerBar = ({ winner: { winner, decide }, className }: WinnerBarProps) => {
  const { t } = useTranslation();

  const options: { value: Verdict; icon: 'check' | 'close'; label: string; colors: string }[] = [
    { value: 1, icon: 'check', label: t('v2.scopes.ideas.status.winner'), colors: CHOSEN_FOR },
    { value: -1, icon: 'close', label: t('v2.scopes.ideas.status.notSelected'), colors: CHOSEN_AGAINST },
  ];

  return (
    <DecisionBar
      label={t('settings.columns.is_winner')}
      options={options}
      value={winner}
      onChange={decide}
      className={className}
    />
  );
};

export default WinnerBar;
