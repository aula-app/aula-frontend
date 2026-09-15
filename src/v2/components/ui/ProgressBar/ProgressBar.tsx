import { PhaseType } from '@/types/SettingsTypes';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  /** Filled share of the track, 0–100. Clamped. */
  value: number;
  /** Palette: the track is `bg-{color}`, the fill `bg-{color}-active`. */
  color: PhaseType;
  /** Accessible name — the bar's own content is treated as decorative. */
  label: string;
  /** Threshold to mark on the track, 0–100, e.g. a quorum. */
  marker?: number;
  /** Rendered inside the marker. Keep it to a few characters — the triangle narrows fast. */
  markerLabel?: ReactNode;
  /** Sits at the leading edge of the fill, like the percentage in a loading bar. Hidden at zero. */
  valueLabel?: ReactNode;
  /** Pinned to the end of the track, and dropped once the fill or marker crowds it. */
  endLabel?: ReactNode;
  /** Pinned inside the left of the bar, e.g. an icon and a count. */
  children?: ReactNode;
  /** Corner radius is the caller's, since bars sit both standalone and as card footers. */
  className?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const FILL_CROWDS_END = 88;
const MARKER_CROWDS_END = 70;

/** Inline progress track shared by every progress and quorum readout. */
const ProgressBar = ({
  value,
  color,
  label,
  marker,
  markerLabel,
  valueLabel,
  endLabel,
  children,
  className,
}: ProgressBarProps) => {
  const progress = clamp(value);
  const threshold = marker === undefined ? undefined : clamp(marker);
  const showValue = valueLabel !== undefined && progress > 0;
  const crowded = progress >= FILL_CROWDS_END || (threshold ?? 0) >= MARKER_CROWDS_END;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={twMerge(
        'relative flex items-center gap-1 overflow-hidden px-2 py-1 text-sm font-medium',
        `bg-${color}-light`,
        `text-${color}-fg`,
        className
      )}
    >
      <div
        className={twMerge(
          'absolute inset-y-0 left-0 flex items-center justify-end transition-[width] duration-500',
          showValue && 'px-2',
          `bg-${color}-active`
        )}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      >
        {showValue && valueLabel}
      </div>

      {threshold !== undefined && (
        <span
          className="absolute inset-y-0 flex justify-center bg-background pt-0.5 text-xs leading-none"
          style={{
            left: `${threshold}%`,
            clipPath: 'polygon(0 0, 100% 0, 0% 100%)',
          }}
          aria-hidden="true"
        >
          <span className="pl-1 pr-4 text-xs -mt-0.5">{markerLabel}</span>
        </span>
      )}

      {endLabel !== undefined && !crowded && (
        <span className="absolute right-2.5" aria-hidden="true">
          {endLabel}
        </span>
      )}

      {children !== undefined && (
        <span className="relative flex items-center gap-1" aria-hidden="true">
          {children}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
