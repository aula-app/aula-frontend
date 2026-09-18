import Button from '@/v2/components/button/Button';
import Icon, { ICON_TYPE } from '@/v2/components/ui/Icon/Icon';
import { twMerge } from 'tailwind-merge';

export interface DecisionOption<T> {
  value: T;
  icon: ICON_TYPE;
  /** Already translated. */
  label: string;
  /** Fill once this option is the one in force. */
  colors: string;
}

interface DecisionBarProps<T> {
  /** Accessible name for the group, e.g. what is being decided. */
  label: string;
  options: DecisionOption<T>[];
  /** The option in force, or null where nothing has been chosen yet. */
  value: T | null;
  onChange: (value: T) => void;
  /** Greys the bar out for viewers who cannot decide. */
  disabled?: boolean;
  /** Corner radius is the caller's, since the bar sits between other bands. */
  className?: string;
}

// Every state names its own hover fill, even where it does not change: without one,
// twMerge leaves Button's `hover:bg-shadow` in place and the option greys over.

/** Options not in force stay grey, whatever they would paint if chosen, so the choice reads at a glance. */
const RESTING = 'bg-neutral-light text-neutral-fg hover:bg-neutral';
const OFF = 'bg-surface text-muted hover:bg-surface';
const OFF_CHOSEN = 'bg-neutral text-neutral-fg hover:bg-neutral';

/** One decision as a band of mutually exclusive options: a vote, a verdict, a pick. */
const DecisionBar = <T,>({ label, options, value, onChange, disabled = false, className }: DecisionBarProps<T>) => (
  <div role="group" aria-label={label} className={twMerge('flex gap-1 overflow-hidden', className)}>
    {options.map((option) => {
      const chosen = value === option.value;

      return (
        <Button
          key={String(option.value)}
          text
          aria-pressed={chosen}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={twMerge(
            'flex-1 flex-col gap-0.5 rounded-none py-1 text-sm shadow-none disabled:opacity-100',
            disabled ? (chosen ? OFF_CHOSEN : OFF) : chosen ? option.colors : RESTING
          )}
        >
          <Icon type={option.icon} size="1.25rem" aria-hidden="true" />
          {option.label}
        </Button>
      );
    })}
  </div>
);

export default DecisionBar;
